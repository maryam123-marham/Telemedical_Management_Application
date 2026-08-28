const router = require('express').Router();
const { body, param } = require('express-validator');
const { Patient } = require('../models');
const { auth, requireRole, validate } = require('../middleware');

router.use(auth);
router.get('/', async (req, res) => {
  const q = (req.query.search || '').trim();
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const filter = q ? { $or: [{ name: new RegExp(escaped, 'i') }, { email: new RegExp(escaped, 'i') }, { phone: new RegExp(escaped, 'i') }] } : {};
  res.json(await Patient.find(filter).sort({ createdAt: -1 }).limit(200));
});
router.get('/:id', param('id').isMongoId(), validate, async (req, res) => {
  const patient = await Patient.findById(req.params.id);
  if (!patient) return res.status(404).json({ message: 'Patient not found' });
  res.json(patient);
});
const patientFields = [body('name').trim().notEmpty(), body('dateOfBirth').isISO8601(), body('email').optional({ values: 'falsy' }).isEmail()];
router.post('/', patientFields, validate, async (req, res) => res.status(201).json(await Patient.create(req.body)));
router.put('/:id', [param('id').isMongoId(), ...patientFields], validate, async (req, res) => {
  const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!patient) return res.status(404).json({ message: 'Patient not found' });
  res.json(patient);
});
router.delete('/:id', requireRole('admin'), param('id').isMongoId(), validate, async (req, res) => {
  const patient = await Patient.findByIdAndDelete(req.params.id);
  if (!patient) return res.status(404).json({ message: 'Patient not found' });
  res.status(204).end();
});
module.exports = router;
