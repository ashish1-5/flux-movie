const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  msg:      { type: String, required: true },
  severity: { type: String, default: 'info' },
  icon:     { type: String, default: 'ℹ️' },
  t:        { type: String, default: () => new Date().toLocaleTimeString() },
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditLogSchema);
