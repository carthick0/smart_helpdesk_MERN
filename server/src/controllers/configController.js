import ConfigService from "../services/configService.js";

class ConfigController {
  async getConfig(req, res) {
    try {
      const config = await ConfigService.getConfig();
      res.json(config);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async updateConfig(req, res) {
    try {
      const updatedConfig = await ConfigService.updateConfig(req.body);
      res.json(updatedConfig);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

export default new ConfigController();
