const express = require("express");
const Command = require("../models/Commande");
const router = express.Router();
const {getCommands, getCommandById, createCommand, deleteCommandById, updateCommandById, updateCommandStatus, getCommandsStats, getCommandsStatsByCustomer, getCommandsByCustomerId, cancelOrder} = require("../controllers/orderController");

router.get('/', getCommands);

router.get('/stats', getCommandsStats);

router.get('/customer/:customerId/stats', getCommandsStatsByCustomer);

router.get('/customer/:customerId', getCommandsByCustomerId);

router.get('/:id', getCommandById);

router.post('/', createCommand);

router.delete('/:id', deleteCommandById);

router.put('/:id', updateCommandById);

router.put('/:id/status', updateCommandStatus);

router.put('/:id/cancel', cancelOrder);



module.exports = router;