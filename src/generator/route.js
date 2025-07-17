// file imports
const { pluralize, toCamelCase, toPascalCase } = require("./helper.js");

/**
 * Generates the content for a route file for a given module.
 * It constructs the route endpoints and exports it using the module name.
 *
 * @param {string} moduleName - The name of the module for which route content is generated.
 * @returns {string} The generated route content as a string with template placeholders.
 */
module.exports = function getRouteContent(moduleName) {
  const camelCaseModuleName = toCamelCase(moduleName);
  const pascalCaseModuleName = toPascalCase(moduleName);
  const pluralPascalCaseModuleName = pluralize(pascalCaseModuleName);
  return `
// module imports
import { Request, Response, Router } from "express";

// file imports
import * as ${camelCaseModuleName}Controller from "./controller";
import { exceptionHandler } from "../../middlewares/exception-handler";
import {
  verifyToken,
  verifyAdmin,
  verifyUser,
} from "../../middlewares/authenticator";

// destructuring assignments

// variable initializations
const router = Router();

router.get(
  "/",
  verifyToken,
  verifyUser,
  exceptionHandler(async (req: Request, res: Response) => {
    const { page, limit } = req.query;
    let { keyword } = req.query;
    keyword = keyword?.toString() || "";
    const args = {
      keyword,
      limit: Number(limit),
      page: Number(page),
    };
    const response = await ${camelCaseModuleName}Controller.get${pluralPascalCaseModuleName}(args);
    res.json(response);
  })
);

router
  .route("/admin")
  .all(verifyToken, verifyAdmin)
  .post(
    exceptionHandler(async (req: Request, res: Response) => {
      const {} = req.body;
      const args = {};
      const response = await ${camelCaseModuleName}Controller.add${pascalCaseModuleName}(args);
      res.json(response);
    })
  )
  .put(
    exceptionHandler(async (req: Request, res: Response) => {
      let { ${camelCaseModuleName} } = req.query;
      const {} = req.body;
      const args = {};
      ${camelCaseModuleName} = ${camelCaseModuleName}?.toString() || "";
      const response = await ${camelCaseModuleName}Controller.update${pascalCaseModuleName}ById(${camelCaseModuleName}, args);
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
      const response = await ${camelCaseModuleName}Controller.get${pluralPascalCaseModuleName}(args);
      res.json(response);
    })
  )
  .delete(
    exceptionHandler(async (req: Request, res: Response) => {
      let { ${camelCaseModuleName} } = req.query;
      ${camelCaseModuleName} = ${camelCaseModuleName}?.toString() || "";
      const response = await ${camelCaseModuleName}Controller.delete${pascalCaseModuleName}ById(${camelCaseModuleName});
      res.json(response);
    })
  );

router.get(
  "/:${camelCaseModuleName}",
  verifyToken,
  verifyAdmin,
  exceptionHandler(async (req: Request, res: Response) => {
    const { ${camelCaseModuleName} } = req.params;
    const response = await ${camelCaseModuleName}Controller.get${pascalCaseModuleName}ById(${camelCaseModuleName});
    res.json(response);
  })
);

export default router;  
`;
};
