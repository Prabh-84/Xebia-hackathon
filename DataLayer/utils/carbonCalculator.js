function calculateCarbon(usage) {
    return (
      usage.vmHours * 0.4 +
      usage.storageGB * 0.02 +
      usage.networkGB * 0.01
    );
  }
  
  module.exports = calculateCarbon;