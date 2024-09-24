import { useState, useEffect, useContext } from "react";
import styles from "../Home/app.module.css";
import { List } from "./components/List";
import { Navbar } from "./components/Navbar";
import Login from "./components/Login";
import { ShoppingCartOutlined, PlusOutlined } from "@ant-design/icons";
import { ShopCartModal } from "./components/ShopCartModal";
import { cart } from "../../api/cart";
import { products } from "../../api/products";
import { Pagination, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useSearchParams } from "react-router-dom";
import {
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  DEFAULT_SORT,
  DEFAULT_SIZE,
} from "../../constants/index";
import { Product } from "../Item/types";
import { CartItem } from "../../constants/types";

function Home() {
  const [elements, setElements] = useState<any[]>([]);
  const [searchElement, setSearchElement] = useState("");
  const [sumCard, setSumCard] = useState(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [sortByPrice, setSortByPrice] = useState<string>(DEFAULT_SORT);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_LIMIT);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { user } = context;

  const fetchProducts = async (page: number, pageSize: number) => {
    const params = {
      title: searchElement,
      sortByPrice,
      page,
      limit: pageSize,
    };

    const { data, error } = await products.getProducts(params);
    if (error) {
      setElements([]);
    } else {
      setElements(data?.products);
      setTotalPages(data?.total);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage, pageSize);
  }, [searchElement, sortByPrice, currentPage, pageSize]);

  useEffect(() => {
    const sort = searchParams.get("sort");
    const current = searchParams.get("page");
    const size = parseInt(searchParams.get("size") || "10");
    setSortByPrice(sort || DEFAULT_SORT);
    setCurrentPage(Number(current) || DEFAULT_PAGE);
    setPageSize(size);
  }, [searchParams]);

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortByPrice(e.target.value);
    setSearchParams({
      page: String(DEFAULT_PAGE),
      size: String(pageSize),
      sort: e.target.value,
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchElement(e.target.value);
    setSearchParams({
      page: String(DEFAULT_PAGE),
      size: String(DEFAULT_LIMIT),
      sort: DEFAULT_SORT,
    });
  };

  const handlePageChange = (current: number, size: number) => {
    const page = size !== pageSize ? DEFAULT_PAGE : current;
    setSearchParams({
      page: String(page),
      size: String(size),
      sort: sortByPrice,
    });
  };

  const handleToggle = (productId: string) => {
    setElements((prevElements) =>
      prevElements.map((element) =>
        element.id === productId
          ? { ...element, favorite: !element.favorite }
          : element
      )
    );
  };

  const handleElementClick = async (productId: string, newText: string) => {
    const { error } = await products.updateProduct(productId, {
      title: newText,
    });

    if (error) {
      setElements([]);
    } else {
      setElements((prevElements) =>
        prevElements.map((element) =>
          element.id === productId ? { ...element, title: newText } : element
        )
      );
    }
  };

  const handleAmountEdit = async (productId: string, newCount: number) => {
    const product = elements.find((el) => el.id === productId);
    if (!product) return;

    const changes = {
      amount: Math.max(0, product.amount - newCount),
    };
    const { error } = await products.updateProduct(productId, changes);

    if (error) {
      setElements([]);
    } else {
      setElements((prevElements) =>
        prevElements.map((element) =>
          element.id === productId
            ? { ...element, amount: changes.amount }
            : element
        )
      );
    }
  };

  useEffect(() => {
    const totalItems = cartItems.reduce(
      (total, item) => total + item.amount,
      0
    );
    setSumCard(totalItems);
  }, [cartItems]);

  const addToCart = async (element: Product, newCount: number) => {
    if (!user || !user.id) {
      console.error("User is not authenticated");
      return;
    }

    const newItem: CartItem = {
      id: element.id,
      cartItemId: "",
      userId: user.id,
      amount: parseInt(String(newCount), 10),
      product: {
        id: element.id,
        title: element.title,
        price: element.price,
        amount: element.amount,
        favorite: element.favorite,
      },
    };

    const existingItemIndex = cartItems.findIndex(
      (item) => item.id === newItem.id
    );
    const { error } = await cart.addToCart(user.id, newItem.id, newItem.amount);

    if (error) {
      console.error("Error adding to cart:", error);
    } else if (existingItemIndex !== -1) {
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex].amount += newItem.amount;
      setCartItems(updatedItems);
    } else {
      setCartItems([...cartItems, newItem]);
    }
  };

  const handleShopCardClick = () => {
    setModalOpen(true);
  };

  const goToForm = () => {
    navigate("/new_product");
  };

  const goToPanel = () => {
    navigate("/admin-panel");
  };

  return (
    <>
      <div>
        <div>
          <header className={styles.top}>
            <div className={styles.circle}>{sumCard}</div>
            <ShoppingCartOutlined
              className={styles.iconCart}
              onClick={handleShopCardClick}
            />
            <div>
              {user && user.role !== "GUEST" && (
                <Button
                  type="primary"
                  className={styles.iconAdmin}
                  onClick={goToPanel}
                >
                  Admin
                </Button>
              )}
            </div>
            <div>
              {user && user.role !== "GUEST" && (
                <PlusOutlined
                  className={styles.iconForm}
                  onClick={goToForm}
                ></PlusOutlined>
              )}
            </div>

            <div className={styles.login}>
              <Login />
            </div>
          </header>
          <div>
            <ShopCartModal
              modalOpen={modalOpen}
              setModalOpen={setModalOpen}
              cartItems={cartItems}
              setCartItems={setCartItems}
              elements={elements}
              setElements={setElements}
            />
          </div>
        </div>
        <div className={styles.containerStyle}>
          <Navbar
            searchElement={searchElement}
            setSearchElement={setSearchElement}
            sortByPrice={sortByPrice}
            setSortByPrice={setSortByPrice}
            handleSort={handleSort}
            handleSearch={handleSearch}
          />

          <div className={styles.container}>
            <List
              handleToggle={handleToggle}
              sortedElements={elements}
              handleElementClick={handleElementClick}
              handleAmountEdit={handleAmountEdit}
              addToCart={addToCart}
            />
            <div className={styles.pag}>
              <Pagination
                showSizeChanger
                pageSizeOptions={DEFAULT_SIZE}
                pageSize={pageSize}
                current={currentPage}
                onChange={handlePageChange}
                total={totalPages}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
