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

function Home() {
  const [elements, setElements] = useState([]);
  const [searchElement, setSearchElement] = useState("");
  const [sumCard, setSumCard] = useState(0);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [sortByPrice, setSortByPrice] = useState(DEFAULT_SORT);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState(DEFAULT_LIMIT);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("UserContext must be used within a UserProvider");
  }
  const { user } = context;

  const fetchProducts = async (page: any, pageSize: any) => {
    const { data, error } = await products.getProducts(
      searchElement,
      sortByPrice,
      page,
      pageSize
    );
    if (error) {
      setElements([]);
    } else {
      setElements(data.currentPage);
      setTotalPages(data.total);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage, pageSize);
  }, [searchElement, sortByPrice, currentPage, pageSize]);

  useEffect(() => {
    const sort: any = searchParams.get("sort");
    const current: any = searchParams.get("page");
    const size = parseInt(searchParams.get("size") as any);
    setSortByPrice(sort || DEFAULT_SORT);
    setCurrentPage(current || DEFAULT_PAGE);
    setPageSize(size || DEFAULT_LIMIT);
  }, [searchParams]);

  const handleSort = (e: any) => {
    setSortByPrice(e.target.value);
    setSearchParams({
      page: DEFAULT_PAGE,
      size: pageSize,
      sort: e.target.value,
    } as any);
  };

  const handleSearch = (e: any) => {
    setSearchElement(e.target.value);
    setSearchParams({
      page: DEFAULT_PAGE,
      size: DEFAULT_LIMIT,
      sort: DEFAULT_SORT,
    } as any);
  };

  const handlePageChange = (current: any, size: any) => {
    const page = size !== pageSize ? DEFAULT_PAGE : current;
    setSearchParams({ page: page, size: size, sort: sortByPrice });
  };

  const handleDeleteItem = async (itemsId: any) => {
    const itemsDeleted = elements.filter(
      (element: any) => element.id !== itemsId
    );

    const { error } = await products.deleteProduct(itemsId);

    if (error) {
      setElements([]);
    } else {
      setElements([...itemsDeleted]);
    }
  };

  const handleToggle = (productId: any) => {
    setElements((prevElements: any) =>
      prevElements.map((element: any) =>
        element.id === productId
          ? { ...element, favorite: !element.favorite }
          : element
      )
    );
  };

  const handleElementClick = async (productId: any, newText: any) => {
    const { error } = await products.editTitle(productId, newText);

    if (error) {
      setElements([]);
    } else {
      setElements((prevElements: any) =>
        prevElements.map((element: any) =>
          element.id === productId ? { ...element, title: newText } : element
        )
      );
    }
  };

  const handleAmountEdit = async (productId: any, newCount: any) => {
    const changes = {
      amount: parseInt((productId.amount - newCount) as any),
    };
    const { error } = await products.changeAmount(productId.id, changes);

    if (error) {
      setElements([]);
    } else {
      setElements((prevElements: any) =>
        prevElements.map((element: any) =>
          element.id === productId.id
            ? {
                ...element,
                amount: Math.max(0, element.amount - newCount),
              }
            : element
        )
      );
    }
  };

  useEffect(() => {
    const totalItems = cartItems.reduce(
      (total, item: any) => total + item.amount,
      0
    );
    setSumCard(totalItems);
  }, [cartItems]);

  const addToCart = async (element: any, newCount: any) => {
    const newItem = {
      id: element.id,
      title: element.title,
      amount: parseInt(newCount),
      price: element.price,
    };
    const existingItemIndex: any = cartItems.findIndex(
      (item) => item.id === newItem.id
    );

    const { error } = await cart.addToCart(newItem);

    if (error) {
      setCartItems([]);
    } else if (existingItemIndex !== -1) {
      cartItems[existingItemIndex].amount += newItem.amount;
      setCartItems([...cartItems]);
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
              handleDeleteItem={handleDeleteItem}
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
                total={totalPages * pageSize}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
