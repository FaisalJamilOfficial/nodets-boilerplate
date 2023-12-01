// module imports
import express, { Request, Response } from "express";

// file imports
import * as elementController from "../controllers/element";
import { exceptionHandler } from "../middlewares/exception-handler";
import { verifyToken, verifyAdmin } from "../middlewares/authenticator";

// destructuring assignments

// variable initializations
const router = express.Router();

router
  .route("/")
  .all(verifyToken, verifyAdmin)
  .post(
    exceptionHandler(async (req: Request, res: Response) => {
      const { title } = req.body;
      const args = { title };
      const response = await elementController.addElement(args);
      res.json({ token: response });
    })
  )
  .put(
    exceptionHandler(async (req: Request, res: Response) => {
      let { element } = req.query;
      const { title } = req.body;
      const args = { title };
      element = element?.toString() || "";
      const response = await elementController.updateElement(element, args);
      res.json(response);
    })
  )
  .get(
    exceptionHandler(async (req: Request, res: Response) => {
      const { page, limit } = req.query;
      let { keyword } = req.query;
      keyword = keyword?.toString() || "";
      const args = {
        keyword,
        limit: Number(limit),
        page: Number(page),
      };
      const response = await elementController.getElements(args);
      res.json(response);
    })
  )
  .delete(
    exceptionHandler(async (req: Request, res: Response) => {
      let { element } = req.query;
      element = element?.toString() || "";
      const response = await elementController.deleteElement(element);
      res.json(response);
    })
  );

router.get(
  "/:element",
  verifyToken,
  verifyAdmin,
  exceptionHandler(async (req: Request, res: Response) => {
    const { element } = req.params;
    const response = await elementController.getElement(element);
    res.json(response);
  })
);

export default router;
