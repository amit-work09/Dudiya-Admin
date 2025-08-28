import PublicService from "../services/publicService.js";
import logger from "../utils/logger.js";

class PublicController {
  async getEduction(req, res) {
    try {
      // let { role, item, skip, search } = req.query;
      let { role, item = 10, pages = 1, search } = req.query;
      let skip = item * (pages - 1);

      const response = await new PublicService().getEduction(
        role,
        item,
        skip,
        search
      );

      return res.status(response.status).json({
        data: response.data,
        count: response.count,
        pages: response.pages,
      });
    } catch (error) {
      console.log(error);
      logger.error(`login Error ${error}`);
      return res
        .status(process.env.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message });
    }
  }
  async getLocation(req, res) {
    try {
      // let { role, item, skip, search } = req.query;
      let { item = 10, pages = 1, search } = req.query;
      let skip = item * (pages - 1);

      const response = await new PublicService().getLocation(
        item,
        skip,
        search
      );

      return res.status(response.status).json({
        data: response.data,
        count: response.count,
        pages: response.pages,
      });
    } catch (error) {
      console.log(error);
      logger.error(`login Error ${error}`);
      return res
        .status(process.env.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message });
    }
  }

  async getStaticPages(req, res) {
    let { key } = req.query;
    try {
      const response = await new PublicService().getStaticPages(key);

      return res.status(response.status).json({ data: response.data[0] });
    } catch (error) {
      logger.error(`login Error ${error}`);
      return res
        .status(process.env.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message });
    }
  }
}

export default new PublicController();
