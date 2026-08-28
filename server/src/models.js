const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['staff', 'admin'], default: 'staff' }
}, { timestamps: true });

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  dateOfBirth: { type: Date, required: true },
  phone: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
  address: String,
  emergencyContact: String,
  notes: String
}, { timestamps: true });

const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  clinician: { type: String, required: true, trim: true },
  scheduledAt: { type: Date, required: true },
  type: { type: String, enum: ['video', 'phone', 'in-person'], default: 'video' },
  status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' },
  reason: String,
  meetingUrl: String
}, { timestamps: true });

const recordSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  clinician: { type: String, required: true },
  diagnosis: { type: String, required: true },
  treatment: String,
  notes: String,
  recordedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = {
  User: mongoose.model('User', userSchema),
  Patient: mongoose.model('Patient', patientSchema),
  Appointment: mongoose.model('Appointment', appointmentSchema),
  MedicalRecord: mongoose.model('MedicalRecord', recordSchema)
};
