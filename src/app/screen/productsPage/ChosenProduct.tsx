import React, { useEffect, useState } from "react";
import {
  Container, Stack, Box, Button, Rating,
  Chip, IconButton, Divider, Skeleton,
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper";
import SwiperCore from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import MemoryOutlinedIcon from "@mui/icons-material/MemoryOutlined";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import StarOutlinedIcon from "@mui/icons-material/StarOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import { Dispatch } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { setChosenProduct, setRestaurant } from "./slice";
import { retreiveChosenProduct, retreiveRestaurant } from "./selector";
import { Product } from "../../../lib/types/product";
import { useParams, useHistory } from "react-router-dom";
import ProductService from "../../services/ProductService";
import MemberService from "../../services/MemberService";
import { Member } from "../../../lib/types/member";
import { serverApi } from "../../../lib/config";
import { CartItem } from "../../../lib/types/search";

// ── Design tokens (TechStore bilan bir xil) ──
const BLUE = "#2979FF";
const BLUE_DARK = "#1565c0";
const BG_MAIN = "rgba(6,6,18,1)";
const BG_CARD = "#0d1020";
const BG_CARD2 = "#111827";
const BORDER = "rgba(41,121,255,0.15)";
const BORDER_LIGHT = "rgba(255,255,255,0.06)";

// ── Redux ──
const actionDispatch = (dispatch: Dispatch) => ({
  setRestaurant: (data: Member) => dispatch(setRestaurant(data)),
  setChosenProduct: (data: Product) => dispatch(setChosenProduct(data)),
});

const chosenProductRetriever = createSelector(
  retreiveChosenProduct,
  (chosenProduct) => ({ chosenProduct })
);
const restaurantRetriever = createSelector(
  retreiveRestaurant,
  (restaurant) => ({ restaurant })
);

interface ChosenProductsProps {
  onAdd: (item: CartItem) => void;
}

export default function ChosenProduct(props: ChosenProductsProps) {
  const { onAdd } = props;
  const { productId } = useParams<{ productId: string }>();
  const history = useHistory();
  const { setRestaurant, setChosenProduct } = actionDispatch(useDispatch());
  const { chosenProduct } = useSelector(chosenProductRetriever);
  const { restaurant } = useSelector(restaurantRetriever);

  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperCore | null>(null);
  const [activeImg, setActiveImg] = useState(0);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setLoading(true);
    const product = new ProductService();
    product
      .getProduct(productId)
      .then((data) => {
        setChosenProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });

    const member = new MemberService();
    member
      .getRestaurant()
      .then((data) => setRestaurant(data))
      .catch((err) => console.log(err));
  }, [productId]);

  const handleAddToCart = () => {
    if (!chosenProduct) return;
    for (let i = 0; i < quantity; i++) {
      onAdd({
        _id: String(chosenProduct._id),
        quantity: 1,
        name: chosenProduct.productName,
        price: chosenProduct.productPrice,
        image: chosenProduct.productImages[0],
      });
    }
  };

  // ── Loading skeleton ──
  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", background: BG_MAIN, pt: 4 }}>
        <Container maxWidth="xl">
          {/* Breadcrumb skeleton */}
          <Skeleton variant="text" width={220} height={24} sx={{ bgcolor: "rgba(255,255,255,0.05)", mb: 3 }} />
          <Stack direction={{ xs: "column", md: "row" }} gap={5}>
            <Skeleton variant="rectangular" sx={{ flex: 1, borderRadius: 3, height: 420, bgcolor: "rgba(255,255,255,0.05)" }} />
            <Box sx={{ flex: 1 }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} variant="text" height={40} sx={{ bgcolor: "rgba(255,255,255,0.05)", mb: 1 }} />
              ))}
            </Box>
          </Stack>
        </Container>
      </Box>
    );
  }

  if (!chosenProduct) return null;

  const images = chosenProduct.productImages ?? [];
  const hasDiscount = false; // kelajakda discount logic qo'shish uchun

  return (
    <Box sx={{ minHeight: "100vh", background: BG_MAIN, pb: 10 }}>

      {/* ── Breadcrumb ── */}
      <Box sx={{ borderBottom: `1px solid ${BORDER}`, background: "rgba(41,121,255,0.04)" }}>
        <Container maxWidth="xl">
          <Stack direction="row" alignItems="center" gap={0.5} sx={{ py: 1.5 }}>
            {[
              { label: "Home", to: "/" },
              { label: "Products", to: "/products" },
              { label: `${chosenProduct.productCollection}`, to: `/products?productCollection=${chosenProduct.productCollection}` },
              { label: chosenProduct.productName, to: null },
            ].map((crumb, i, arr) => (
              <React.Fragment key={i}>
                {crumb.to ? (
                  <Box
                    onClick={() => history.push(crumb.to!)}
                    sx={{
                      fontSize: 12, color: "rgba(255,255,255,0.4)", cursor: "pointer",
                      "&:hover": { color: BLUE }, transition: "color 0.2s",
                    }}
                  >
                    {crumb.label}
                  </Box>
                ) : (
                  <Box sx={{ fontSize: 12, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>
                    {crumb.label}
                  </Box>
                )}
                {i < arr.length - 1 && (
                  <NavigateNextIcon sx={{ fontSize: 14, color: "rgba(255,255,255,0.2)" }} />
                )}
              </React.Fragment>
            ))}
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ pt: 5 }}>
        <Stack direction={{ xs: "column", lg: "row" }} gap={6} alignItems="flex-start">

          {/* ══ LEFT: Image Gallery ══ */}
          <Box sx={{ flex: "0 0 auto", width: { xs: "100%", lg: 520 } }}>

            {/* Main image */}
            <Box sx={{
              position: "relative", borderRadius: "20px", overflow: "hidden",
              border: `1px solid ${BORDER}`,
              background: BG_CARD,
              boxShadow: `0 0 60px rgba(41,121,255,0.08)`,
              mb: 2,
            }}>
              {/* Brand badge */}
              <Box sx={{
                position: "absolute", top: 16, left: 16, zIndex: 2,
                background: "rgba(41,121,255,0.9)", backdropFilter: "blur(8px)",
                borderRadius: "8px", px: 1.5, py: 0.5,
                fontSize: 11, fontWeight: 700, color: "#fff", letterSpacing: 1,
                textTransform: "uppercase",
              }}>
                {chosenProduct.productBrand}
              </Box>

              {/* Views badge */}
              <Stack direction="row" alignItems="center" gap={0.5} sx={{
                position: "absolute", top: 16, right: 16, zIndex: 2,
                background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
                borderRadius: "8px", px: 1.2, py: 0.5,
              }}>
                <RemoveRedEyeIcon sx={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }} />
                <Box sx={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
                  {chosenProduct.productViews}
                </Box>
              </Stack>

              {/* Main swiper */}
              <Swiper
                loop={images.length > 1}
                navigation={images.length > 1}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                modules={[FreeMode, Navigation, Thumbs]}
                onSlideChange={(swiper) => setActiveImg(swiper.realIndex)}
                style={{ width: "100%", height: 420 }}
              >
                {images.map((img, idx) => (
                  <SwiperSlide key={idx}>
                    <Box
                      component="img"
                      src={`${serverApi}/${img}`}
                      alt={chosenProduct.productName}
                      sx={{
                        width: "100%", height: 420, objectFit: "contain",
                        p: 3, background: BG_CARD,
                      }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </Box>

            {/* Thumbnails */}
            {images.length > 1 && (
              <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={Math.min(images.length, 5)}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
              >
                {images.map((img, idx) => (
                  <SwiperSlide key={idx}>
                    <Box sx={{
                      borderRadius: "10px", overflow: "hidden",
                      border: `2px solid ${activeImg === idx ? BLUE : BORDER_LIGHT}`,
                      cursor: "pointer", transition: "border-color 0.2s",
                      "&:hover": { borderColor: `${BLUE}88` },
                      background: BG_CARD2,
                    }}>
                      <Box
                        component="img"
                        src={`${serverApi}/${img}`}
                        sx={{ width: "100%", height: 76, objectFit: "contain", p: 1 }}
                      />
                    </Box>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </Box>

          {/* ══ RIGHT: Product Info ══ */}
          <Box sx={{ flex: 1, minWidth: 0 }}>

            {/* Collection tag */}
            <Chip
              label={chosenProduct.productCollection}
              size="small"
              sx={{
                background: "rgba(41,121,255,0.12)", color: BLUE,
                border: `1px solid ${BORDER}`, fontSize: 11, fontWeight: 600,
                mb: 2, letterSpacing: 0.5,
              }}
            />

            {/* Product name */}
            <Box sx={{
              fontSize: { xs: 26, md: 34 }, fontWeight: 900, color: "#fff",
              fontFamily: "'Orbitron', monospace", lineHeight: 1.2, mb: 2,
              letterSpacing: -0.5,
            }}>
              {chosenProduct.productName}
            </Box>

            {/* Rating + views row */}
            <Stack direction="row" alignItems="center" gap={2} mb={3}>
              <Stack direction="row" alignItems="center" gap={0.8}>
                <Rating
                  value={chosenProduct.productRating ?? 0}
                  precision={0.5}
                  readOnly
                  size="small"
                  sx={{ "& .MuiRating-iconFilled": { color: "#fbbf24" } }}
                />
                <Box sx={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
                  ({chosenProduct.productReviewCount ?? 0} reviews)
                </Box>
              </Stack>
              <Box sx={{ width: 1, height: 14, background: BORDER }} />
              <Stack direction="row" alignItems="center" gap={0.5}>
                <RemoveRedEyeIcon sx={{ fontSize: 15, color: "rgba(255,255,255,0.3)" }} />
                <Box sx={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
                  {chosenProduct.productViews} views
                </Box>
              </Stack>
              <Stack direction="row" alignItems="center" gap={0.5}>
                <FavoriteBorderIcon sx={{ fontSize: 15, color: "rgba(255,255,255,0.3)" }} />
                <Box sx={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
                  {chosenProduct.productLikes} likes
                </Box>
              </Stack>
            </Stack>

            {/* Price */}
            <Stack direction="row" alignItems="baseline" gap={1.5} mb={3}>
              <Box sx={{
                fontSize: { xs: 32, md: 42 }, fontWeight: 900,
                color: BLUE, fontFamily: "'Orbitron', monospace",
                filter: `drop-shadow(0 0 12px ${BLUE}55)`,
              }}>
                ${chosenProduct.productPrice.toLocaleString()}
              </Box>
            </Stack>

            {/* Specs grid */}
            <Box sx={{
              background: "rgba(41,121,255,0.06)",
              border: `1px solid ${BORDER}`,
              borderRadius: "14px", p: 2.5, mb: 3,
            }}>
              <Box sx={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: 1.5, mb: 2, textTransform: "uppercase" }}>
                Core Specs
              </Box>
              <Stack direction="row" flexWrap="wrap" gap={2}>
                {[
                  { icon: <MemoryOutlinedIcon sx={{ fontSize: 16, color: BLUE }} />, label: "RAM", value: `${chosenProduct.productRam} GB` },
                  { icon: <StorageOutlinedIcon sx={{ fontSize: 16, color: BLUE }} />, label: "Storage", value: `${chosenProduct.productMemory} GB` },
                  { icon: <InventoryOutlinedIcon sx={{ fontSize: 16, color: chosenProduct.productLeftCount > 10 ? "#22c55e" : "#f59e0b" }} />, label: "In Stock", value: chosenProduct.productLeftCount > 0 ? `${chosenProduct.productLeftCount} left` : "Out of stock" },
                  { icon: <StarOutlinedIcon sx={{ fontSize: 16, color: "#fbbf24" }} />, label: "Rating", value: `${chosenProduct.productRating ?? 0} / 5` },
                ].map((spec, i) => (
                  <Stack key={i} direction="row" alignItems="center" gap={1}
                    sx={{
                      flex: "1 1 calc(50% - 8px)", minWidth: 130,
                      background: "rgba(255,255,255,0.03)",
                      border: `1px solid ${BORDER_LIGHT}`,
                      borderRadius: "10px", p: 1.5,
                    }}
                  >
                    {spec.icon}
                    <Box>
                      <Box sx={{ fontSize: 10, color: "rgba(255,255,255,0.3)", lineHeight: 1 }}>{spec.label}</Box>
                      <Box sx={{ fontSize: 14, fontWeight: 700, color: "#fff", lineHeight: 1.5 }}>{spec.value}</Box>
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </Box>

            {/* Description */}
            {chosenProduct.productDesc && (
              <Box sx={{
                fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.8,
                mb: 3, p: 2, borderLeft: `3px solid ${BLUE}`,
                background: "rgba(41,121,255,0.04)", borderRadius: "0 10px 10px 0",
              }}>
                {chosenProduct.productDesc}
              </Box>
            )}

            <Divider sx={{ borderColor: BORDER, mb: 3 }} />

            {/* Quantity selector */}
            <Stack direction="row" alignItems="center" gap={2} mb={3}>
              <Box sx={{ fontSize: 13, color: "rgba(255,255,255,0.4)", minWidth: 70 }}>Quantity</Box>
              <Stack direction="row" alignItems="center" gap={1}>
                <IconButton
                  size="small"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  sx={{
                    border: `1px solid ${BORDER}`, borderRadius: "8px",
                    color: "rgba(255,255,255,0.6)", width: 32, height: 32,
                    "&:hover": { borderColor: BLUE, color: BLUE },
                  }}
                >
                  <Box sx={{ fontSize: 18, lineHeight: 1, mb: "2px" }}>−</Box>
                </IconButton>
                <Box sx={{
                  minWidth: 44, textAlign: "center",
                  fontSize: 16, fontWeight: 700, color: "#fff",
                }}>
                  {quantity}
                </Box>
                <IconButton
                  size="small"
                  onClick={() => setQuantity((q) => Math.min(chosenProduct.productLeftCount, q + 1))}
                  sx={{
                    border: `1px solid ${BORDER}`, borderRadius: "8px",
                    color: "rgba(255,255,255,0.6)", width: 32, height: 32,
                    "&:hover": { borderColor: BLUE, color: BLUE },
                  }}
                >
                  <Box sx={{ fontSize: 18, lineHeight: 1, mb: "2px" }}>+</Box>
                </IconButton>
              </Stack>
              <Box sx={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>
                {chosenProduct.productLeftCount} available
              </Box>
            </Stack>

            {/* CTA Buttons */}
            <Stack direction={{ xs: "column", sm: "row" }} gap={1.5} mb={3}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<ShoppingCartOutlinedIcon />}
                onClick={handleAddToCart}
                disabled={chosenProduct.productLeftCount === 0}
                sx={{
                  background: BLUE, color: "#fff",
                  fontWeight: 700, py: 1.5, px: 3,
                  borderRadius: "12px", textTransform: "none", fontSize: 15,
                  boxShadow: `0 4px 20px ${BLUE}44`,
                  "&:hover": { background: BLUE_DARK, boxShadow: `0 6px 28px ${BLUE}66` },
                  "&:disabled": { background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.3)" },
                  transition: "all 0.2s",
                }}
              >
                Add to Cart
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<BoltOutlinedIcon />}
                sx={{
                  borderColor: BORDER, color: "rgba(255,255,255,0.7)",
                  fontWeight: 600, py: 1.5, px: 3,
                  borderRadius: "12px", textTransform: "none", fontSize: 15,
                  "&:hover": {
                    borderColor: BLUE, color: "#fff",
                    background: "rgba(41,121,255,0.08)",
                  },
                  transition: "all 0.2s",
                }}
              >
                Buy Now
              </Button>
            </Stack>

            {/* Badges */}
            <Stack direction="row" gap={3}>
              <Stack direction="row" alignItems="center" gap={1}>
                <LocalShippingOutlinedIcon sx={{ fontSize: 18, color: BLUE }} />
                <Box sx={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Free Express Delivery</Box>
              </Stack>
              <Stack direction="row" alignItems="center" gap={1}>
                <VerifiedOutlinedIcon sx={{ fontSize: 18, color: "#22c55e" }} />
                <Box sx={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>2 Year Warranty</Box>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
