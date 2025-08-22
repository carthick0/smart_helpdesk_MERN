import configRepository from "../repositories/configRepository.js";
class ConfigService{
    async getConfig(){
        let config=await configRepository.findOne();
        if (!config) {
            config = await configRepository.create({});
        }
        return config;
    }
    async updateConfig(data) {
    const config = await configRepository.findOne();
    if (!config) {
      return configRepository.create(data);
    }
    Object.assign(config, data);
    return config.save();
  }
}

export default new ConfigService();
