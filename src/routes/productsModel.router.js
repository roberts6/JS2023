import { productModel } from "../models/products.model.js";
import CustomRouter from "../routes/customRouter.js";
import handlePolicies from "../middleware/handlePolicies.js"; // manejo de las políticas de acceso para cada rol
import { generateToken, authToken, verifyToken } from '../utilidades/token.js';

class ProductsRouter extends CustomRouter {
  constructor() {
    super();
    this.initRoutes();
  }

  initRoutes() {
    this.get('/',authToken,handlePolicies(['user', 'admin', 'superadmin']), async (req, res) => {
      try {
        const { limit = 10, page = 1, sort } = req.query;

        const filter = {};
        if (req.query.filter) {
          Object.entries(req.query.filter).forEach(([key, value]) => {
            filter[key] = value;
          });
        }

        const sortObj = {};
        if (sort === 'asc') {
          sortObj.price = 1;
        } else if (sort === 'desc') {
          sortObj.price = -1;
        }

        const totalCount = await productModel.countDocuments(filter);
        const totalPages = Math.ceil(totalCount / limit);
        const skip = (page - 1) * limit;

        const products = await productModel.find(filter)
          .sort(sortObj)
          .limit(limit)
          .skip(skip);

        const hasPrevPage = page > 1;
        const hasNextPage = page < totalPages;
        const prevPage = hasPrevPage ? page - 1 : null;
        const nextPage = hasNextPage ? page + 1 : null;

        const prevLink = hasPrevPage ? `/products?page=${prevPage}&limit=${limit}&sort=${sort}` : null;
        const nextLink = hasNextPage ? `/products?page=${nextPage}&limit=${limit}&sort=${sort}` : null;

        const responseObject = {
          status: 'success',
          payload: products,
          totalPages: totalPages,
          prevPage: prevPage,
          nextPage: nextPage,
          page: page,
          hasPrevPage: hasPrevPage,
          hasNextPage: hasNextPage,
          prevLink: prevLink,
          nextLink: nextLink
        };

        res.render('productList', { productos: products });
      } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
      }
    });

    this.get('/:id',authToken,handlePolicies(['user', 'admin', 'superadmin']), async (req, res) => {
      const { id } = req.params;

      try {
        const product = await productModel.findById(id);

        if (!product) {
          return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const productObj = product.toObject();
        res.render('productDetail', { productos: [productObj] });
      } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
      }
    });
     // solo va a acceder a este método quien tenga un rol de Admin
    this.post('/',authToken,verifyToken,handlePolicies(['admin', 'superadmin']), async (req, res) => {
      try {
        const { title, description, price, thumbnail, code, stock } = req.body;
            const newProduct = new productModel({
              title,
              description,
              price,
              thumbnail,
              code,
              stock,
            });
            await newProduct.save();
            const response = {
              message: 'Producto creado',
              data: newProduct,
            };
            res.json(response);
           } catch (error) {
        res.status(500).json({ error: 'Error al crear el producto' });
      }
    });
      // solo va a acceder a este método quien tenga un rol de Admin
    this.put('/:id',authToken,handlePolicies(['admin', 'superadmin']), async (req, res) => {
      const { id } = req.params;
      try {
        const updatedProduct = await productModel.findByIdAndUpdate(
                id,
                { title, description, price, thumbnail, code, stock },
                { new: true }
              );
          
              if (!updatedProduct) {
                return res.status(404).json({ error: 'Producto no encontrado' });
              }
          
              const response = {
                message: 'Producto actualizado',
                data: updatedProduct,
              };
              res.json(response);
      } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto' });
      }
    });

     // solo va a acceder a este método quien tenga un rol de Admin
    this.delete('/:id',authToken,handlePolicies(['admin', 'superadmin']), async (req, res) => {
      const { id } = req.params;
      try {
        const deletedProduct = await productModel.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const response = {
      message: 'Producto eliminado',
      data: deletedProduct,
    };
    res.json(response);
      } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
      }
    });
  }
}

export default new ProductsRouter().getRouter();