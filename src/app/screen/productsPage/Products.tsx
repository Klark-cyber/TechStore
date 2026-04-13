import React, { ChangeEvent, useEffect, useState } from "react";
import { Box, Container, Stack, IconButton, Chip } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import StarIcon from "@mui/icons-material/Star";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import VerifiedIcon from "@mui/icons-material/Verified";
import { Dispatch } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { setProducts } from "./slice";
import { retreiveProducts } from "./selector";
import { Product, ProductInquiry } from "../../../lib/types/product";
import ProductService from "../../services/ProductService";
import { ProductCollection } from "../../../lib/enums/product.enum";
import { serverApi } from "../../../lib/config";
import { useHistory } from "react-router-dom";
import { CartItem } from "../../../lib/types/search";
import { useGlobals } from "../../hooks/useGlobals";

const BLUE = "#2979FF";
const BG = "#080814";
const BG2 = "#0d1020";
const BG3 = "#111827";
const BORDER = "rgba(41,121,255,0.15)";

const actionDispatch = (dispatch: Dispatch) => ({
  setProducts: (data: Product[]) => dispatch(setProducts(data)),
});

const productsRetriever = createSelector(
  retreiveProducts,
  (products) => ({ products })
);

interface ProductsProps {
  onAdd: (item: CartItem) => void;
}

const RAM_MEMORY_COLLECTIONS = [
  ProductCollection.LAPTOPS,
  ProductCollection.MACBOOKS,
  ProductCollection.PC,
  ProductCollection.TELEPHONE,
];

const PARTNERS = [
  { name: "Apple", logo: "🍎", desc: "Premium devices" },
  { name: "Samsung", logo: "🔵", desc: "Galaxy series" },
  { name: "Sony", logo: "⚫", desc: "Electronics & Audio" },
  { name: "Microsoft", logo: "🪟", desc: "Surface & Xbox" },
  { name: "LG", logo: "🔴", desc: "OLED & Smart TV" },
  { name: "Lenovo", logo: "🟠", desc: "ThinkPad & Legion" },
  { name: "ASUS", logo: "🟣", desc: "ROG & ZenBook" },
  { name: "Dell", logo: "🔷", desc: "XPS & Alienware" },
];

export default function Products(props: ProductsProps) {
  const { onAdd } = props;
  const { setProducts } = actionDispatch(useDispatch());
  const { products } = useSelector(productsRetriever);
  const { authMember } = useGlobals();
  const history = useHistory();

  const [productSearch, setProductSearch] = useState<ProductInquiry>({
    page: 1,
    limit: 8,
    order: "createdAt",
    productCollection: ProductCollection.TELEPHONE,
    search: "",
  });

  const [searchText, setSearchText] = useState<string>("");
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const productList: Product[] = Array.isArray(products) ? products : [];

  useEffect(() => {
    const service = new ProductService();
    service
      .getProducts(productSearch)
      .then((data: any) => {
        const list = Array.isArray(data) ? data : data?.list ?? [];
        setProducts(list);
      })
      .catch((err) => console.log("getProducts error:", err));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productSearch]);

  useEffect(() => {
    if (searchText === "") {
      productSearch.search = "";
      setProductSearch({ ...productSearch });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  const searchCollectionHandler = (collection: ProductCollection) => {
    productSearch.page = 1;
    productSearch.productCollection = collection;
    setProductSearch({ ...productSearch });
  };

  const searchOrderHandler = (order: string) => {
    productSearch.page = 1;
    productSearch.order = order;
    setProductSearch({ ...productSearch });
  };

  const searchProductHandler = () => {
    productSearch.search = searchText;
    setProductSearch({ ...productSearch });
  };

  const paginationHandler = (e: ChangeEvent<any>, value: number) => {
    productSearch.page = value;
    setProductSearch({ ...productSearch });
  };

  const chooseProductHandler = (id: string) => {
    history.push(`/products/${id}`);
  };

  const likeHandler = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    if (!authMember) {
      history.push("/");
      return;
    }
    setLikedProducts((prev) => {
      const next = new Set(prev);
      next.has(productId) ? next.delete(productId) : next.add(productId);
      return next;
    });
  };

  const needsRamMemory = (collection: ProductCollection) =>
    RAM_MEMORY_COLLECTIONS.includes(collection);

  const collections = [
    { label: "Phones", value: ProductCollection.TELEPHONE },
    { label: "Laptops", value: ProductCollection.LAPTOPS },
    { label: "MacBooks", value: ProductCollection.MACBOOKS },
    { label: "PC", value: ProductCollection.PC },
    { label: "Accessories", value: ProductCollection.ACCESSORIES },
    { label: "Smartwatches", value: ProductCollection.SMARTWATCHES },
    { label: "Others", value: ProductCollection.OTHERS },
  ];

  const orders = [
    { label: "New", value: "createdAt" },
    { label: "Price", value: "productPrice" },
    { label: "Popular", value: "productViews" },
    { label: "Rating", value: "productRating" },
  ];

  return (
    <Box sx={{ minHeight: "100vh", background: BG, pt: 4, pb: 10, position: "relative" }}>
      {/* Grid bg */}
      <Box
        sx={{
          position: "fixed", inset: 0,
          backgroundImage:
            "linear-gradient(rgba(41,121,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(41,121,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          zIndex: 0, pointerEvents: "none",
        }}
      />

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>

        {/* ── SEARCH + COLLECTION ── */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems={{ xs: "stretch", md: "center" }}
          justifyContent="space-between"
          gap={2} mb={3}
        >
          <Stack
            direction="row" alignItems="center"
            sx={{
              maxWidth: 400,
              background: "rgba(255,255,255,0.04)",
              border: `1px solid rgba(255,255,255,0.08)`,
              borderRadius: "12px", overflow: "hidden",
              "&:focus-within": { border: `1px solid ${BLUE}`, background: "rgba(41,121,255,0.05)" },
              transition: "all 0.2s",
            }}
          >
            <SearchIcon sx={{ ml: 2, color: "rgba(255,255,255,0.3)", fontSize: 18 }} />
            <input
              type="search"
              placeholder="Search products..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") searchProductHandler(); }}
              style={{
                flex: 1, background: "transparent", border: "none", outline: "none",
                padding: "11px 14px", fontSize: 14, color: "#fff", fontFamily: "inherit",
              }}
            />
            <Box
              onClick={searchProductHandler}
              sx={{
                px: 2, py: 1.4, background: BLUE, cursor: "pointer",
                display: "flex", alignItems: "center",
                "&:hover": { background: "#1565c0" }, transition: "background 0.2s",
              }}
            >
              <SearchIcon sx={{ color: "#fff", fontSize: 17 }} />
            </Box>
          </Stack>

          <Stack direction="row" gap={1} flexWrap="wrap">
            {collections.map((col) => (
              <Chip
                key={col.value}
                label={col.label}
                onClick={() => searchCollectionHandler(col.value)}
                sx={{
                  background: productSearch.productCollection === col.value ? BLUE : "rgba(255,255,255,0.05)",
                  color: productSearch.productCollection === col.value ? "#fff" : "rgba(255,255,255,0.55)",
                  border: productSearch.productCollection === col.value
                    ? `1px solid ${BLUE}` : "1px solid rgba(255,255,255,0.08)",
                  fontWeight: productSearch.productCollection === col.value ? 700 : 400,
                  fontSize: 13, cursor: "pointer", transition: "all 0.2s",
                  "&:hover": { background: "rgba(41,121,255,0.2)", color: "#fff" },
                  "& .MuiChip-label": { px: 1.5 },
                }}
              />
            ))}
          </Stack>
        </Stack>

        {/* ── SORT ── */}
        <Stack direction="row" alignItems="center" gap={2} mb={4}>
          <Box sx={{ fontSize: 12, color: "rgba(255,255,255,0.3)", flexShrink: 0 }}>Sort by:</Box>
          {orders.map((o) => (
            <Box
              key={o.value}
              onClick={() => searchOrderHandler(o.value)}
              sx={{
                fontSize: 13,
                fontWeight: productSearch.order === o.value ? 700 : 400,
                color: productSearch.order === o.value ? BLUE : "rgba(255,255,255,0.4)",
                cursor: "pointer", pb: 0.3,
                borderBottom: productSearch.order === o.value ? `2px solid ${BLUE}` : "2px solid transparent",
                transition: "all 0.2s",
                "&:hover": { color: BLUE },
              }}
            >
              {o.label}
            </Box>
          ))}
        </Stack>

        {/* ── PRODUCT GRID ── */}
        {productList.length !== 0 ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(3, 1fr)", md: "repeat(4, 1fr)" },
              gap: { xs: 2, md: 2.5 },
            }}
          >
            {productList.map((product: Product, idx: number) => {
              const productId = product._id.toString();
              const imagePath = `${serverApi}/${product.productImages[0]}`;
              const isLiked = likedProducts.has(productId);
              const isHovered = hoveredCard === productId;
              const showRamMemory = needsRamMemory(product.productCollection);

              return (
                <Box
                  key={productId}
                  onClick={() => chooseProductHandler(productId)}
                  onMouseEnter={() => setHoveredCard(productId)}
                  onMouseLeave={() => setHoveredCard(null)}
                  sx={{
                    background: BG2,
                    border: `1px solid ${isHovered ? BLUE : "rgba(255,255,255,0.06)"}`,
                    borderRadius: "16px", overflow: "hidden", cursor: "pointer",
                    transition: "all 0.3s ease",
                    transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                    boxShadow: isHovered ? `0 16px 40px rgba(41,121,255,0.2)` : "none",
                    animation: `fadeUp 0.5s ${idx * 0.04}s ease both`,
                    "@keyframes fadeUp": {
                      from: { opacity: 0, transform: "translateY(20px)" },
                      to: { opacity: 1, transform: "translateY(0)" },
                    },
                  }}
                >
                  <Box sx={{ position: "relative", height: { xs: 160, md: 210 }, overflow: "hidden", background: BG3 }}>
                    <Box
                      component="img"
                      src={imagePath}
                      alt={product.productName}
                      sx={{
                        width: "100%", height: "100%", objectFit: "cover",
                        transition: "transform 0.4s ease",
                        transform: isHovered ? "scale(1.07)" : "scale(1)",
                      }}
                    />

                    {/* Rating */}
                    <Box sx={{
                      position: "absolute", top: 10, right: 10,
                      background: "rgba(8,8,20,0.85)", backdropFilter: "blur(8px)",
                      border: "1px solid rgba(255,200,0,0.25)",
                      borderRadius: "8px", px: 0.9, py: 0.4,
                      display: "flex", alignItems: "center", gap: 0.4,
                    }}>
                      <StarIcon sx={{ fontSize: 11, color: "#fbbf24" }} />
                      <Box sx={{ fontSize: 11, fontWeight: 700, color: "#fbbf24" }}>
                        {product.productRating?.toFixed(1) ?? "0.0"}
                      </Box>
                      {product.productReviewCount > 0 && (
                        <Box sx={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>
                          ({product.productReviewCount})
                        </Box>
                      )}
                    </Box>

                    {/* Brand */}
                    {product.productBrand && (
                      <Box sx={{
                        position: "absolute", top: 10, left: 10,
                        background: "rgba(41,121,255,0.18)", border: `1px solid ${BORDER}`,
                        borderRadius: "6px", px: 1, py: 0.3,
                        fontSize: 10, fontWeight: 700, color: "#60a5fa",
                        backdropFilter: "blur(8px)", textTransform: "uppercase", letterSpacing: 0.5,
                      }}>
                        {product.productBrand}
                      </Box>
                    )}

                    {/* Hover overlay */}
                    <Box sx={{
                      position: "absolute", inset: 0,
                      background: "rgba(8,8,20,0.55)",
                      opacity: isHovered ? 1 : 0,
                      transition: "opacity 0.3s ease",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 1.5,
                    }}>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          onAdd({
                            _id: productId,
                            quantity: 1,
                            name: product.productName,
                            price: product.productPrice,
                            image: product.productImages[0],
                          });
                        }}
                        sx={{
                          background: BLUE, color: "#fff", width: 46, height: 46,
                          boxShadow: `0 4px 20px rgba(41,121,255,0.5)`,
                          "&:hover": { background: "#1565c0", transform: "scale(1.1)" },
                          transition: "all 0.2s",
                        }}
                      >
                        <ShoppingCartOutlinedIcon sx={{ fontSize: 20 }} />
                      </IconButton>

                      <IconButton
                        onClick={(e) => likeHandler(e, productId)}
                        sx={{
                          background: isLiked ? "rgba(239,68,68,0.25)" : "rgba(255,255,255,0.1)",
                          color: isLiked ? "#ef4444" : "#fff",
                          width: 46, height: 46,
                          border: isLiked ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(255,255,255,0.15)",
                          "&:hover": { background: "rgba(239,68,68,0.25)", color: "#ef4444", transform: "scale(1.1)" },
                          transition: "all 0.2s",
                        }}
                      >
                        {isLiked ? <FavoriteIcon sx={{ fontSize: 19 }} /> : <FavoriteBorderIcon sx={{ fontSize: 19 }} />}
                      </IconButton>

                      <Box sx={{
                        background: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: "50%", width: 46, height: 46,
                        display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column",
                      }}>
                        <RemoveRedEyeIcon sx={{ fontSize: 16, color: "rgba(255,255,255,0.7)" }} />
                        <Box sx={{ fontSize: 9, color: "rgba(255,255,255,0.45)", lineHeight: 1.2 }}>
                          {product.productViews}
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  {/* INFO */}
                  <Box sx={{ p: { xs: 1.5, md: 2 } }}>
                    <Box sx={{ fontSize: { xs: 13, md: 14 }, fontWeight: 600, color: "#fff", mb: 0.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {product.productName}
                    </Box>

                    {showRamMemory && (
                      <Stack direction="row" gap={1} mb={0.5}>
                        {product.productRam && (
                          <Box sx={{ fontSize: 10, px: 0.8, py: 0.2, background: "rgba(41,121,255,0.1)", border: `1px solid ${BORDER}`, borderRadius: "4px", color: "#60a5fa" }}>
                            {product.productRam}GB RAM
                          </Box>
                        )}
                        {product.productMemory && (
                          <Box sx={{ fontSize: 10, px: 0.8, py: 0.2, background: "rgba(41,121,255,0.1)", border: `1px solid ${BORDER}`, borderRadius: "4px", color: "#60a5fa" }}>
                            {product.productMemory}GB
                          </Box>
                        )}
                      </Stack>
                    )}

                    <Stack direction="row" alignItems="center" gap={1.5} mb={1}>
                      <Stack direction="row" alignItems="center" gap={0.4}>
                        <FavoriteIcon sx={{ fontSize: 11, color: "#ef4444" }} />
                        <Box sx={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{product.productLikes ?? 0}</Box>
                      </Stack>
                      {product.productReviewCount > 0 && (
                        <Box sx={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{product.productReviewCount} reviews</Box>
                      )}
                      <Stack direction="row" alignItems="center" gap={0.4}>
                        <RemoveRedEyeIcon sx={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }} />
                        <Box sx={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{product.productViews}</Box>
                      </Stack>
                    </Stack>

                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Box sx={{ fontSize: { xs: 15, md: 17 }, fontWeight: 800, color: BLUE }}>
                        ${product.productPrice.toLocaleString()}
                      </Box>
                      <IconButton
                        size="small"
                        onClick={(e) => { e.stopPropagation(); chooseProductHandler(productId); }}
                        sx={{
                          background: "rgba(41,121,255,0.1)", border: `1px solid ${BORDER}`,
                          color: BLUE, width: 30, height: 30, fontSize: 15,
                          "&:hover": { background: BLUE, color: "#fff" }, transition: "all 0.2s",
                        }}
                      >
                        →
                      </IconButton>
                    </Stack>
                  </Box>
                </Box>
              );
            })}
          </Box>
        ) : (
          <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 400 }}>
            <Box sx={{ fontSize: 52, mb: 2, opacity: 0.2 }}>📦</Box>
            <Box sx={{ fontSize: 15, color: "rgba(255,255,255,0.25)", fontWeight: 500 }}>
              Products are not available
            </Box>
          </Stack>
        )}

        {/* ── PAGINATION ── */}
        <Stack alignItems="center" mt={6}>
          <Pagination
            count={productList.length !== 0 ? productSearch.page + 1 : productSearch.page}
            page={productSearch.page}
            renderItem={(item) => (
              <PaginationItem
                components={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                {...item}
                color="primary"
              />
            )}
            onChange={paginationHandler}
            sx={{
              "& .MuiPaginationItem-root": {
                color: "rgba(255,255,255,0.5)",
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.03)",
                borderRadius: "8px",
                "&:hover": { background: "rgba(41,121,255,0.1)", borderColor: BLUE, color: "#fff" },
              },
              "& .MuiPaginationItem-root.Mui-selected": {
                background: BLUE, borderColor: BLUE, color: "#fff", fontWeight: 700,
                "&:hover": { background: "#1565c0" },
              },
            }}
          />
        </Stack>

        {/* ── PARTNERS ── */}
        <Box sx={{ mt: 10, pt: 6, borderTop: `1px solid ${BORDER}` }}>
          <Stack alignItems="center" mb={6}>
            <Box sx={{ fontSize: 12, fontWeight: 600, color: BLUE, letterSpacing: 2, textTransform: "uppercase", mb: 1 }}>
              Trusted worldwide
            </Box>
            <Box sx={{ fontSize: { xs: 22, md: 30 }, fontWeight: 900, color: "#fff", fontFamily: "'Orbitron', monospace", letterSpacing: -0.5, textAlign: "center" }}>
              Bizning Hamkorlarimiz
            </Box>
            <Box sx={{ fontSize: 14, color: "rgba(255,255,255,0.4)", mt: 1, textAlign: "center", maxWidth: 500 }}>
              Dunyoning yetakchi texnologiya brendlari bilan rasmiy hamkorlikda ishlaymiz
            </Box>
          </Stack>

          <Box sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(4, 1fr)" },
            gap: 2,
          }}>
            {PARTNERS.map((partner, i) => (
              <Box
                key={i}
                sx={{
                  background: BG2,
                  border: `1px solid rgba(255,255,255,0.06)`,
                  borderRadius: "16px",
                  p: 3,
                  display: "flex", flexDirection: "column", alignItems: "center",
                  gap: 1.5, cursor: "default",
                  transition: "all 0.3s ease",
                  animation: `fadeUp 0.5s ${i * 0.06}s ease both`,
                  "&:hover": {
                    border: `1px solid ${BLUE}`,
                    transform: "translateY(-4px)",
                    boxShadow: `0 12px 32px rgba(41,121,255,0.15)`,
                    background: "rgba(13,16,32,0.9)",
                  },
                }}
              >
                <Box sx={{ fontSize: 36 }}>{partner.logo}</Box>
                <Box>
                  <Stack direction="row" alignItems="center" gap={0.5} justifyContent="center">
                    <Box sx={{ fontSize: 15, fontWeight: 700, color: "#fff", textAlign: "center" }}>
                      {partner.name}
                    </Box>
                    <VerifiedIcon sx={{ fontSize: 14, color: BLUE }} />
                  </Stack>
                  <Box sx={{ fontSize: 12, color: "rgba(255,255,255,0.35)", textAlign: "center", mt: 0.3 }}>
                    {partner.desc}
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* ── MAP ── */}
        <Box sx={{ mt: 8, pt: 6, borderTop: `1px solid ${BORDER}` }}>
          <Stack alignItems="center" mb={5}>
            <Box sx={{ fontSize: 12, fontWeight: 600, color: BLUE, letterSpacing: 2, textTransform: "uppercase", mb: 1 }}>
              Find us
            </Box>
            <Box sx={{ fontSize: { xs: 22, md: 30 }, fontWeight: 900, color: "#fff", fontFamily: "'Orbitron', monospace" }}>
              Our Address
            </Box>
          </Stack>
          <Box sx={{ borderRadius: "16px", overflow: "hidden", border: `1px solid ${BORDER}`, boxShadow: `0 0 40px rgba(41,121,255,0.08)` }}>
            <iframe
              src="https://maps.google.com/maps?q=Abdulla%20Kahhar%20Street%2022%20Tashkent&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="400"
              style={{ display: "block", border: "none", filter: "invert(0.9) hue-rotate(180deg)" }}
              title="Our Address"
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
