function normalizeData(record) {
    return {
      projectId: record.projectId,
      provider: record.provider,
      month: record.month,
      vmHours: record.vmHours || 0,
      storageGB: record.storageGB || 0,
      networkGB: record.networkGB || 0,
      cloudCost: record.cloudCost || 0
    };
  }
  
  module.exports = normalizeData;