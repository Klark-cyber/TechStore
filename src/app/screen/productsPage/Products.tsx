import React, { useEffect, useState, useCallback } from "react";
import {
  Box, Container, Stack, Pagination, CircularProgress,
  PaginationItem,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useHistory, useLocation } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import StarIcon from "@mui/icons-material/Star";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import WhatshotIcon from "@mui/icons-material/Whatshot";

import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { setProducts } from "./slice";
import { retreiveProducts } from "./selector";
import { Product, ProductInquiry } from "../../../lib/types/product";
import { ProductCollection } from "../../../lib/enums/product.enum";
import ProductService from "../../services/ProductService";
import { CartItem } from "../../../lib/types/search";
import { serverApi, Messages } from "../../../lib/config";
import { useGlobals } from "../../hooks/useGlobals";
import { sweetErrorHandling, sweetTopSmallSuccessAlert } from "../../../lib/sweetAlert";

const BLUE = "#2979ff";
const BLUE_DARK = "#1565c0";
const BORDER = "rgba(41,121,255,0.15)";
const BG = "#060b13";
const CARD = "rgba(13,16,32,0.95)";

const PRODUCTS_PER_PAGE = 8;

const actionDispatch = (dispatch: Dispatch) => ({
  setProducts: (data: Product[]) => dispatch(setProducts(data)),
});

const productsRetriever = createSelector(
  retreiveProducts,
  (products) => ({ products })
);

const collectionTabs = [
  { label: "All", value: null },
  { label: "Phones", value: ProductCollection.TELEPHONE },
  { label: "Laptops", value: ProductCollection.LAPTOPS },
  { label: "PC", value: ProductCollection.PC },
  { label: "Notebooks", value: ProductCollection.MACBOOKS },
  { label: "Smartwatches", value: ProductCollection.SMARTWATCHES },
  { label: "Accessories", value: ProductCollection.ACCESSORIES },
  { label: "Others", value: ProductCollection.OTHERS },
];

const sortOptions = [
  { label: "New", value: "createdAt", icon: <NewReleasesIcon sx={{ fontSize: 14 }} /> },
  { label: "Price", value: "productPrice", icon: <AttachMoneyIcon sx={{ fontSize: 14 }} /> },
  { label: "Popular", value: "productViews", icon: <WhatshotIcon sx={{ fontSize: 14 }} /> },
];

// localStorage key for liked products
const LIKED_KEY = "ts_liked_products";

const loadLikedFromStorage = (): Set<string> => {
  try {
    const raw = localStorage.getItem(LIKED_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
};

const saveLikedToStorage = (ids: Set<string>) => {
  localStorage.setItem(LIKED_KEY, JSON.stringify(Array.from(ids)));
};

interface ProductsProps {
  onAdd: (item: CartItem) => void;
}

export default function Products(props: ProductsProps) {
  const { onAdd } = props;
  const { authMember } = useGlobals();
  const { setProducts } = actionDispatch(useDispatch());
  const { products } = useSelector(productsRetriever);
  const targetProducts: Product[] = Array.isArray(products) ? products : [];
  const history = useHistory();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const initCollection = (queryParams.get("productCollection") as ProductCollection) || null;
  const initBrand = queryParams.get("productBrand") || undefined;

  const [inquiry, setInquiry] = useState<ProductInquiry>({
    page: 1,
    limit: PRODUCTS_PER_PAGE,
    order: "createdAt",
    productCollection: initCollection || undefined,
    productBrand: initBrand,
    search: undefined,
  });
  const [activeCollection, setActiveCollection] = useState<ProductCollection | null>(initCollection);
  const [activeOrder, setActiveOrder] = useState<string>("createdAt");
  const [searchText, setSearchText] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [hasNoProducts, setHasNoProducts] = useState(false);

  // Like state — localStorage based, only when logged in
  const [likedIds, setLikedIds] = useState<Set<string>>(
    authMember ? loadLikedFromStorage() : new Set()
  );

  // Clear likes when user logs out
  useEffect(() => {
    if (!authMember) {
      setLikedIds(new Set());
      localStorage.removeItem(LIKED_KEY);
    }
  }, [authMember]);

  // totalPages pagination uchun (hozir ishlatilmayapti)
  // const totalPages = Math.ceil(totalCount / PRODUCTS_PER_PAGE);

  // ── Fetch ──────────────────────────────────────────────────
  const fetchProducts = useCallback(async (inq: ProductInquiry) => {
    setLoading(true);
    setHasNoProducts(false);
    try {
      const service = new ProductService();
      const data: any = await service.getProducts(inq);
      const list: Product[] = Array.isArray(data) ? data : data?.list ?? [];

      setProducts(list);

      // meLiked backenddan kelsa liked set yangilanadi
      if (authMember) {
        const liked = new Set<string>(
          list
            .filter((p: any) => p.meLiked && p.meLiked.length > 0)
            .map((p: Product) => (p._id as unknown) as string)
        );
        setLikedIds(liked);
        saveLikedToStorage(liked);
      }

      if (list.length === 0) setHasNoProducts(true);
    } catch (err: any) {
      // Backend NOT_FOUND qaytarsa — bo'sh list, products tozalanmaydi
      const status = err?.response?.status ?? err?.code;
      if (status === 404 || err?.message === "NO_DATA_FOUND") {
        setProducts([]);
        setHasNoProducts(true);
      }
      // Boshqa xatoliklarda mavjud productlarni saqlab qolamiz
    } finally {
      setLoading(false);
    }
  }, [authMember]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync URL → state
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const col = (params.get("productCollection") as ProductCollection) || undefined;
    const brand = params.get("productBrand") || undefined;
    const newInq: ProductInquiry = {
      ...inquiry,
      page: 1,
      productCollection: col,
      productBrand: brand,
    };
    setInquiry(newInq);
    setActiveCollection(col ?? null);
    fetchProducts(newInq);
  }, [location.search]); // eslint-disable-line react-hooks/exhaustive-deps

  // Login/logout bo'lganda liked holatni yangilash uchun qayta fetch
  useEffect(() => {
    fetchProducts(inquiry);
  }, [authMember]); // eslint-disable-line react-hooks/exhaustive-deps

  // Page change
  useEffect(() => {
    fetchProducts(inquiry);
  }, [inquiry.page, inquiry.order]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Handlers ───────────────────────────────────────────────
  const handleCollectionChange = (col: ProductCollection | null) => {
    const params = new URLSearchParams();
    if (col) params.set("productCollection", col);
    history.push(`/products${params.toString() ? "?" + params.toString() : ""}`);
  };

  const handleSearchProduct = () => {
    const newInq = { ...inquiry, page: 1, search: searchText || undefined };
    setInquiry(newInq);
    fetchProducts(newInq);
  };

  // searchText bo'shatilsa avtomatik reset
  useEffect(() => {
    if (searchText === "") {
      const newInq = { ...inquiry, page: 1, search: undefined };
      setInquiry(newInq);
      fetchProducts(newInq);
    }
  }, [searchText]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleOrderChange = (order: string) => {
    setActiveOrder(order);
    const newInq = { ...inquiry, page: 1, order };
    setInquiry(newInq);
    fetchProducts(newInq);
  };

  const handlePageChange = (_: any, page: number) => {
    setInquiry((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLike = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    try {
      if (!authMember) throw new Error(Messages.error2);
      const alreadyLiked = likedIds.has(productId);

      // Backend request
      const service = new ProductService();
      await service.likeTargetProduct(productId);

      // Update liked set + localStorage
      setLikedIds((prev) => {
        const next = new Set(prev);
        alreadyLiked ? next.delete(productId) : next.add(productId);
        saveLikedToStorage(next);
        return next;
      });

      // Optimistic count update — backend real count bilan mos kelishi uchun
      // Faqat UI ni yangilaymiz, backend ga ishonib
      setProducts(
        targetProducts.map((p) =>
          (p._id as unknown as string) === productId
            ? {
                ...p,
                productLikes: Math.max(0,
                  alreadyLiked ? p.productLikes - 1 : p.productLikes + 1
                ),
              }
            : p
        )
      );
    } catch (err) {
      sweetErrorHandling(err).then();
    }
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    onAdd({
      _id: (product._id as unknown) as string,
      quantity: 1,
      name: product.productName,
      price: product.productPrice,
      image: product.productImages?.[0] ?? "",
    });
    sweetTopSmallSuccessAlert("Added to cart!", 700);
  };

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="products-page">
      <Box sx={{ background: BG, minHeight: "100vh", pb: 10 }}>
        <Container maxWidth="xl">

          {/* ── Page Header ── */}
          <Box sx={{ pt: 6, pb: 4, textAlign: "center" }}>
            <Box sx={{
              fontSize: 11, fontWeight: 700, color: BLUE,
              letterSpacing: 3, textTransform: "uppercase", mb: 1.5,
            }}>
              TechStore Online Shop
            </Box>
            <Box sx={{
              fontSize: { xs: 24, md: 36 }, fontWeight: 900, color: "#fff",
              fontFamily: "'Orbitron', monospace", letterSpacing: -0.5,
            }}>
              Our Products
            </Box>
            <Box sx={{ width: 48, height: 3, background: BLUE, borderRadius: "2px", mx: "auto", mt: 2, mb: 4 }} />

            {/* Search — burak mantiqicha */}
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              sx={{ maxWidth: 480, mx: "auto" }}
            >
              <Stack
                direction="row"
                alignItems="center"
                sx={{
                  flex: 1,
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid rgba(255,255,255,0.1)`,
                  borderRadius: "12px",
                  overflow: "hidden",
                  "&:focus-within": { border: `1px solid ${BLUE}`, background: "rgba(41,121,255,0.05)" },
                  transition: "all 0.2s",
                }}
              >
                <input
                  type="search"
                  className="single-search-input"
                  placeholder="Search products..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSearchProduct(); }}
                  style={{
                    flex: 1, background: "transparent", border: "none", outline: "none",
                    padding: "11px 16px", fontSize: 14, color: "#fff",
                    fontFamily: "inherit",
                  }}
                />
                <Box
                  onClick={handleSearchProduct}
                  className="single-button-search"
                  sx={{
                    px: 2.5, py: 1.4,
                    background: BLUE, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 0.5,
                    fontSize: 13, fontWeight: 600, color: "#fff",
                    "&:hover": { background: BLUE_DARK },
                    transition: "background 0.2s",
                    whiteSpace: "nowrap",
                  }}
                >
                  🔍 Search
                </Box>
              </Stack>
            </Stack>
          </Box>

          {/* ── Collection Tabs ── */}
          <Stack direction="row" gap={1} flexWrap="wrap" justifyContent="center" mb={2}>
            {collectionTabs.map((tab) => {
              const isActive = activeCollection === tab.value;
              return (
                <Box
                  key={tab.label}
                  onClick={() => handleCollectionChange(tab.value)}
                  sx={{
                    px: 2.5, py: 0.9,
                    borderRadius: "24px",
                    border: `1px solid ${isActive ? BLUE : BORDER}`,
                    background: isActive ? BLUE : "rgba(255,255,255,0.03)",
                    color: isActive ? "#fff" : "rgba(255,255,255,0.5)",
                    fontSize: 13, fontWeight: isActive ? 700 : 500,
                    cursor: "pointer", transition: "all 0.2s",
                    "&:hover": { borderColor: BLUE, color: "#fff", background: isActive ? BLUE : "rgba(41,121,255,0.08)" },
                  }}
                >
                  {tab.label}
                </Box>
              );
            })}
          </Stack>

          {/* ── Sort Options ── */}
          <Stack direction="row" alignItems="center" justifyContent="center" gap={3} mb={5}>
            <Box sx={{ fontSize: 12, color: "rgba(255,255,255,0.3)", letterSpacing: 0.5 }}>Sort by:</Box>
            {sortOptions.map((opt) => {
              const isActive = activeOrder === opt.value;
              return (
                <Stack
                  key={opt.value}
                  direction="row" alignItems="center" gap={0.5}
                  onClick={() => handleOrderChange(opt.value)}
                  sx={{
                    cursor: "pointer", fontSize: 13, fontWeight: isActive ? 700 : 400,
                    color: isActive ? BLUE : "rgba(255,255,255,0.4)",
                    pb: 0.3,
                    borderBottom: isActive ? `2px solid ${BLUE}` : "2px solid transparent",
                    transition: "all 0.2s",
                    "&:hover": { color: BLUE },
                  }}
                >
                  {opt.icon}
                  {opt.label}
                </Stack>
              );
            })}
          </Stack>

          {/* ── Products Grid ── */}
          {loading ? (
            <Stack alignItems="center" justifyContent="center" py={12}>
              <CircularProgress sx={{ color: BLUE }} size={40} />
            </Stack>
          ) : hasNoProducts ? (
            <Stack alignItems="center" justifyContent="center" py={12} gap={2}>
              <Box sx={{
                width: 80, height: 80, borderRadius: "50%",
                border: `2px solid ${BORDER}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "rgba(41,121,255,0.05)",
              }}>
                <Box sx={{ fontSize: 36, lineHeight: 1 }}>📦</Box>
              </Box>
              <Box sx={{
                fontFamily: "'Orbitron', monospace",
                fontSize: { xs: 14, md: 16 }, fontWeight: 700,
                color: "rgba(255,255,255,0.15)", letterSpacing: 1, textAlign: "center",
              }}>
                No products yet in this category
              </Box>
              <Box
                onClick={() => handleCollectionChange(null)}
                sx={{
                  mt: 1, px: 3, py: 1,
                  border: `1px solid ${BORDER}`, borderRadius: "24px",
                  color: BLUE, fontSize: 13, cursor: "pointer",
                  "&:hover": { background: "rgba(41,121,255,0.08)" },
                }}
              >
                View all products
              </Box>
            </Stack>
          ) : (
            <Box sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(3,1fr)", md: "repeat(4,1fr)" },
              gap: 2.5,
            }}>
              {targetProducts.map((product) => {
                const productId = (product._id as unknown) as string;
                const isLiked = likedIds.has(productId);
                const imageSrc = product.productImages?.[0]
                  ? `${serverApi}/${product.productImages[0]}`
                  : "/icons/default-product.svg";
                const shortDesc = product.productDesc
                  ? product.productDesc.slice(0, 22) + (product.productDesc.length > 22 ? "…" : "")
                  : null;

                return (
                  <Box
                    key={productId}
                    onClick={() => history.push(`/products/${productId}`)}
                    sx={{
                      background: CARD,
                      border: `1px solid ${BORDER}`,
                      borderRadius: "14px",
                      overflow: "hidden",
                      cursor: "pointer",
                      position: "relative",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        borderColor: BLUE,
                        transform: "translateY(-4px)",
                        boxShadow: `0 12px 32px rgba(41,121,255,0.18)`,
                        "& .p-actions": { opacity: 1, transform: "translateX(-50%) translateY(0)" },
                        "& .p-img": { transform: "scale(1.06)" },
                      },
                    }}
                  >
                    {/* Image */}
                    <Box sx={{ position: "relative", overflow: "hidden", aspectRatio: "1/1", background: "#111827" }}>
                      <Box
                        className="p-img"
                        component="img"
                        src={imageSrc}
                        alt={product.productName}
                        sx={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
                      />

                      {/* Brand badge */}
                      {product.productBrand && (
                        <Box sx={{
                          position: "absolute", top: 8, left: 8,
                          px: 1, py: 0.3, borderRadius: "6px",
                          background: "rgba(6,11,19,0.82)", backdropFilter: "blur(4px)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: 0.5,
                        }}>
                          {product.productBrand}
                        </Box>
                      )}

                      {/* Like button — always visible top-right */}
                      <Box
                        onClick={(e) => handleLike(e, productId)}
                        sx={{
                          position: "absolute", top: 8, right: 8,
                          width: 32, height: 32, borderRadius: "50%",
                          background: "rgba(6,11,19,0.75)", backdropFilter: "blur(4px)",
                          border: `1px solid ${isLiked ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)"}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          cursor: "pointer", transition: "all 0.2s",
                          "&:hover": { background: "rgba(239,68,68,0.15)", borderColor: "#ef4444" },
                        }}
                      >
                        {isLiked
                          ? <FavoriteIcon sx={{ fontSize: 15, color: "#ef4444" }} />
                          : <FavoriteBorderIcon sx={{ fontSize: 15, color: "rgba(255,255,255,0.55)" }} />
                        }
                      </Box>

                      {/* Cart button — visible on hover at bottom */}
                      <Box
                        className="p-actions"
                        onClick={(e) => handleAddToCart(e, product)}
                        sx={{
                          position: "absolute", bottom: 10, left: "50%",
                          transform: "translateX(-50%) translateY(12px)",
                          opacity: 0,
                          transition: "all 0.25s ease",
                          display: "flex", alignItems: "center", gap: 0.8,
                          background: BLUE,
                          borderRadius: "24px",
                          px: 2, py: 0.8,
                          boxShadow: `0 4px 16px rgba(41,121,255,0.5)`,
                          whiteSpace: "nowrap",
                          cursor: "pointer",
                          zIndex: 2,
                        }}
                      >
                        <ShoppingCartOutlinedIcon sx={{ fontSize: 15, color: "#fff" }} />
                        <Box sx={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>Add to Cart</Box>
                      </Box>
                    </Box>

                    {/* Info */}
                    <Box sx={{ p: { xs: 1.5, md: 2 } }}>
                      <Box sx={{
                        fontSize: 14, fontWeight: 600, color: "#fff",
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", mb: 0.4,
                      }}>
                        {product.productName}
                      </Box>

                      {shortDesc && (
                        <Box sx={{
                          fontSize: 11, color: "rgba(255,255,255,0.3)",
                          mb: 0.8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>
                          {shortDesc}
                        </Box>
                      )}

                      <Stack direction="row" alignItems="center" gap={1.5} mb={1}>
                        <Stack direction="row" alignItems="center" gap={0.3}>
                          <StarIcon sx={{ fontSize: 12, color: "#f59e0b" }} />
                          <Box sx={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>
                            {product.productRating?.toFixed(1) ?? "0.0"}
                          </Box>
                        </Stack>
                        <Stack direction="row" alignItems="center" gap={0.3}>
                          <VisibilityOutlinedIcon sx={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }} />
                          <Box sx={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{product.productViews}</Box>
                        </Stack>
                        <Stack direction="row" alignItems="center" gap={0.3}>
                          <FavoriteIcon sx={{ fontSize: 12, color: isLiked ? "#ef4444" : "rgba(255,255,255,0.25)" }} />
                          <Box sx={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{product.productLikes}</Box>
                        </Stack>
                      </Stack>

                      <Box sx={{ fontSize: 17, fontWeight: 800, color: BLUE }}>
                        ${product.productPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          )}

          {/* ── Pagination ── */}
          {/* Show pagination if: products exist OR page > 1 (so user can go back from empty page) */}
          {(targetProducts.length > 0 || inquiry.page > 1) && !loading && (
            <Stack alignItems="center" mt={6} gap={1}>
              <Pagination
                count={
                  targetProducts.length === PRODUCTS_PER_PAGE
                    ? inquiry.page + 1   // full page → likely more
                    : inquiry.page        // last page or empty → no next
                }
                page={inquiry.page}
                onChange={handlePageChange}
                renderItem={(item) => (
                  <PaginationItem
                    components={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                    {...item}
                    color="primary"
                  />
                )}
                sx={{
                  "& .MuiPaginationItem-root": {
                    color: "rgba(255,255,255,0.5)",
                    border: `1px solid ${BORDER}`,
                    borderRadius: "8px",
                    "&:hover": { background: "rgba(41,121,255,0.1)", borderColor: BLUE, color: "#fff" },
                  },
                  "& .MuiPaginationItem-root.Mui-selected": {
                    background: BLUE, borderColor: BLUE, color: "#fff", fontWeight: 700,
                    "&:hover": { background: BLUE_DARK },
                  },
                  "& .MuiPaginationItem-root.Mui-disabled": {
                    opacity: 0.3,
                  },
                }}
              />
              {/* Current page info */}
              <Box sx={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>
                Page {inquiry.page}
                {targetProducts.length > 0 && ` · ${targetProducts.length} products`}
              </Box>
            </Stack>
          )}

          {/* ── Partners ── */}
          <Box sx={{ mt: 10, pt: 6, borderTop: `1px solid ${BORDER}` }}>
            <Stack alignItems="center" mb={5}>
              <Box sx={{ fontSize: 11, fontWeight: 700, color: BLUE, letterSpacing: 3, textTransform: "uppercase", mb: 1 }}>
                Trusted By
              </Box>
              <Box sx={{ fontSize: { xs: 20, md: 28 }, fontWeight: 900, color: "#fff", fontFamily: "'Orbitron', monospace" }}>
                Our Partners
              </Box>
              <Box sx={{ width: 40, height: 3, background: BLUE, borderRadius: "2px", mt: 1.5 }} />
            </Stack>

            <Box sx={{
              display: "grid",
              gridTemplateColumns: { xs: "repeat(3,1fr)", sm: "repeat(4,1fr)", md: "repeat(6,1fr)" },
              gap: 2,
            }}>
              {[
                { name: "Samsung", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/200px-Samsung_Logo.svg.png" },
                { name: "Apple", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
                { name: "Sony", logo: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg" },
                { name: "LG", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/LG_logo_%282015%29.svg/200px-LG_logo_%282015%29.svg.png" },
                { name: "Dell", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Dell_Logo.svg/200px-Dell_Logo.svg.png" },
                { name: "HP", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/HP_logo_2012.svg/200px-HP_logo_2012.svg.png" },
                { name: "Lenovo", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Lenovo_logo_2015.svg/200px-Lenovo_logo_2015.svg.png" },
                { name: "Asus", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/ASUS_Logo.svg/200px-ASUS_Logo.svg.png" },
                { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/200px-Microsoft_logo.svg.png" },
                { name: "Xiaomi", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Xiaomi_logo.svg/200px-Xiaomi_logo.svg.png" },
                { name: "Huawei", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Huawei_Logo.svg/200px-Huawei_Logo.svg.png" },
                { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/200px-Google_2015_logo.svg.png" },
              ].map((p) => (
                <Stack
                  key={p.name}
                  alignItems="center" justifyContent="center" gap={1.5}
                  sx={{
                    background: CARD, border: `1px solid ${BORDER}`,
                    borderRadius: "12px", p: 2.5,
                    transition: "all 0.2s",
                    "&:hover": { borderColor: BLUE, background: "rgba(41,121,255,0.06)" },
                  }}
                >
                  <Box
                    component="img" src={p.logo} alt={p.name}
                    sx={{
                      width: 48, height: 28, objectFit: "contain",
                      filter: "brightness(0) invert(1)", opacity: 0.45,
                      transition: "opacity 0.2s",
                      ".MuiStack-root:hover &": { opacity: 0.85 },
                    }}
                    onError={(e: any) => { e.target.style.display = "none"; }}
                  />
                  <Box sx={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: 0.5 }}>
                    {p.name}
                  </Box>
                </Stack>
              ))}
            </Box>
          </Box>

          {/* ── Location ── */}
          <Box sx={{ mt: 10, pt: 6, borderTop: `1px solid ${BORDER}` }}>
            <Stack direction={{ xs: "column", md: "row" }} gap={4} alignItems="stretch">

              {/* Left: Info card */}
              <Stack
                gap={3}
                sx={{
                  flex: 1,
                  background: CARD,
                  border: `1px solid ${BORDER}`,
                  borderRadius: "16px",
                  p: { xs: 3, md: 4 },
                  justifyContent: "center",
                }}
              >
                <Box>
                  <Box sx={{ fontSize: 11, fontWeight: 700, color: BLUE, letterSpacing: 3, textTransform: "uppercase", mb: 1 }}>
                    Find Us
                  </Box>
                  <Box sx={{ fontSize: { xs: 22, md: 28 }, fontWeight: 900, color: "#fff", fontFamily: "'Orbitron', monospace" }}>
                    Our Address
                  </Box>
                  <Box sx={{ width: 40, height: 3, background: BLUE, borderRadius: "2px", mt: 1.5 }} />
                </Box>

                <Stack gap={2}>
                  <Stack direction="row" alignItems="flex-start" gap={1.5}>
                    <Box sx={{
                      width: 36, height: 36, borderRadius: "10px", flexShrink: 0,
                      background: "rgba(41,121,255,0.1)", border: `1px solid ${BORDER}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <LocationOnIcon sx={{ fontSize: 18, color: BLUE }} />
                    </Box>
                    <Box>
                      <Box sx={{ fontSize: 12, color: "rgba(255,255,255,0.35)", mb: 0.3 }}>Address</Box>
                      <Box sx={{ fontSize: 14, color: "#fff", fontWeight: 500 }}>
                        Abdulla Kahhar Street 22, Tashkent, Uzbekistan
                      </Box>
                    </Box>
                  </Stack>

                  <Stack direction="row" gap={1.5}>
                    <Box
                      component="a"
                      href="https://www.google.com/maps/dir/?api=1&destination=Abdulla+Kahhar+Street+22+Tashkent"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 1,
                        py: 1.2, borderRadius: "10px",
                        background: BLUE, color: "#fff",
                        fontSize: 13, fontWeight: 600, textDecoration: "none",
                        transition: "background 0.2s",
                        "&:hover": { background: BLUE_DARK },
                      }}
                    >
                      <OpenInNewIcon sx={{ fontSize: 16 }} />
                      Get Directions
                    </Box>
                    <Box
                      component="a"
                      href="https://maps.kakao.com/link/search/Tashkent+Uzbekistan"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 1,
                        py: 1.2, borderRadius: "10px",
                        border: `1px solid ${BORDER}`, color: "rgba(255,255,255,0.6)",
                        fontSize: 13, fontWeight: 600, textDecoration: "none",
                        transition: "all 0.2s",
                        "&:hover": { borderColor: "#f9c74f", color: "#f9c74f", background: "rgba(249,199,79,0.06)" },
                      }}
                    >
                      🗺 Kakao Map
                    </Box>
                  </Stack>
                </Stack>
              </Stack>

              {/* Right: Embedded map */}
              <Box
                sx={{
                  flex: 2, borderRadius: "16px", overflow: "hidden",
                  border: `1px solid ${BORDER}`, minHeight: 320,
                }}
              >
                <iframe
                  title="TechStore Location"
                  src="https://maps.google.com/maps?q=Abdulla%20Kahhar%20Street%2022%20Tashkent&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ display: "block", border: "none", minHeight: 320, filter: "invert(0.9) hue-rotate(180deg)" }}
                />
              </Box>
            </Stack>
          </Box>

        </Container>
      </Box>
    </div>
  );
}