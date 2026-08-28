const router = require('express').Router();
const { body, param } = require('express-validator');
const { Appointment, Patient } = require('../models');
const { auth, validate } = require('../middleware');
router.use(auth);
router.get('/', async (req, res) => {
  const filter = req.query.status ? { status: req.query.status } : {};
  res.json(await Appointment.find(filter).populate('patient', 'name dateOfBirth').sort({ scheduledAt: 1 }).limit(200));
});
router.get('/:id', param('id').isMongoId(), validate, async (req, res) => {
  const item = await Appointment.findById(req.params.id).populate('patient', 'name');
  if (!item) return res.status(404).json({ message: 'Appointment not found' });
  res.json(item);
});
const fields = [body('patient').isMongoId(), body('clinician').trim().notEmpty(), body('scheduledAt').isISO8601(), body('type').optional().isIn(['video', 'phone', 'in-person']), body('status').optional().isIn(['scheduled', 'completed', 'cancelled'])];
router.post('/', fields, validate, async (req, res) => {
  if (!await Patient.exists({ _id: req.body.patient })) return res.status(400).json({ message: 'Patient not found' });
  res.status(201).json(await (await Appointment.create(req.body)).populate('patient', 'name'));
});
router.put('/:id', [param('id').isMongoId(), ...fields], validate, async (req, res) => {
  const item = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('patient', 'name');
  if (!item) return res.status(404).json({ message: 'Appointment not found' });
  res.json(item);
});
router.delete('/:id', param('id').isMongoId(), validate, async (req, res) => {
  if (!await Appointment.findByIdAndDelete(req.params.id)) return res.status(404).json({ message: 'Appointment not found' });
  res.status(204).end();
});
module.exports = router;
