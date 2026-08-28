const router = require('express').Router();
const { body, param } = require('express-validator');
const { MedicalRecord, Patient } = require('../models');
const { auth, requireRole, validate } = require('../middleware');
router.use(auth);
router.get('/', async (req, res) => {
  const filter = req.query.patient && /^[a-f\d]{24}$/i.test(req.query.patient) ? { patient: req.query.patient } : {};
  res.json(await MedicalRecord.find(filter).populate('patient', 'name').sort({ recordedAt: -1 }).limit(200));
});
router.get('/:id', param('id').isMongoId(), validate, async (req, res) => {
  const item = await MedicalRecord.findById(req.params.id).populate('patient', 'name');
  if (!item) return res.status(404).json({ message: 'Medical record not found' });
  res.json(item);
});
const fields = [body('patient').isMongoId(), body('clinician').trim().notEmpty(), body('diagnosis').trim().notEmpty()];
router.post('/', fields, validate, async (req, res) => {
  if (!await Patient.exists({ _id: req.body.patient })) return res.status(400).json({ message: 'Patient not found' });
  res.status(201).json(await (await MedicalRecord.create(req.body)).populate('patient', 'name'));
});
router.put('/:id', [param('id').isMongoId(), ...fields], validate, async (req, res) => {
  const item = await MedicalRecord.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('patient', 'name');
  if (!item) return res.status(404).json({ message: 'Medical record not found' });
  res.json(item);
});
router.delete('/:id', requireRole('admin'), param('id').isMongoId(), validate, async (req, res) => {
  if (!await MedicalRecord.findByIdAndDelete(req.params.id)) return res.status(404).json({ message: 'Medical record not found' });
  res.status(204).end();
});
module.exports = router;
