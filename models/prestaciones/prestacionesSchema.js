const mongoose = require('mongoose');

const pagoSchema = new mongoose.Schema({
  monto: {
    type: Number,
    required: false,
    min: 0
  },
  fecha: {
    type: Date,
    required: false,
    default: Date.now
  },
  odontologoId: {
    type: String,
    required: false
  },
  nombreOdontologo: {  // Nuevo campo
    type: String,
    required: false
  },
  editadoPor: {
    type: String
  },
  nombreEditor: {      // Nuevo campo
    type: String
  },
  fechaEdicion: {
    type: Date
  },
  eliminado: {
    type: Boolean,
    default: false
  },
  eliminadoPor: {
    type: String
  },
  nombreEliminador: {  // Nuevo campo
    type: String
  },
  fechaEliminacion: {
    type: Date
  }
});

const prestacionesSchema = new mongoose.Schema({
  pacienteId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Paciente', 
    required: [false, 'El ID del paciente es obligatorio']
  },
  tratamientoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tratamiento',
    required: [false, 'El ID del tratamiento es obligatorio']
  },
  precio: {
    type: Number, 
    required: false, 
    min: 0,
    message: 'El precio es obligatorio y debe ser mayor a 0'
  },
  pagos: [pagoSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  creadoPor: {
    type: String,
    required: false
  },
  nombreCreador: {     // Nuevo campo
    type: String,
    required: false
  },
  modificadoPor: {
    type: String
  },
  nombreModificador: { // Nuevo campo
    type: String
  },
  fechaModificacion: {
    type: Date
  },
  eliminado: {
    type: Boolean,
    default: false
  },
  eliminadoPor: {
    type: String
  },
  nombreEliminador: {  // Nuevo campo
    type: String
  },
  fechaEliminacion: {
    type: Date
  }
});


// Virtual para calcular el total pagado
prestacionesSchema.virtual('totalPagado').get(function() {
  return this.pagos.reduce((total, pago) => 
    pago.eliminado ? total : total + pago.monto, 0
  );
});

// Virtual para calcular el saldo pendiente
prestacionesSchema.virtual('saldoPendiente').get(function() {
  return this.precio - this.totalPagado;
});

// Asegurar que los virtuals se incluyan cuando el documento se convierte a JSON
prestacionesSchema.set('toJSON', { virtuals: true });
prestacionesSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Prestaciones', prestacionesSchema);