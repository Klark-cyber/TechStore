import React from "react";
import { Box, Container, Stack, IconButton } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useSelector } from "react-redux";
import { retriveNewDishes } from "./selector";
import { createSelector } from "reselect";
import { Product } from "../../../lib/types/product";
import { ProductCollection } from "../../../lib/enums/product.enum";
import { serverApi } from "../../../lib/config";
import { useHistory } from "react-router-dom";
import { CartItem } from "../../../lib/types/search";

const BLUE = "#2979FF";
const BG2 = "#0d1020";
const BG3 = "#111827";
const BORDER = "rgba(41,121,255,0.15)";

const RAM_MEMORY_COLLECTIONS = [
  ProductCollection.LAPTOPS,
  ProductCollection.MACBOOKS,
  ProductCollection.PC,
  ProductCollection.TELEPHONE,
];

const newDishesRetriever = createSelector(
  retriveNewDishes,
  (newDishes) => ({ newDishes })
);

interface NewArrivalsProps {
  onAdd: (item: CartItem) => void;
}

export default function NewArrivals(props: NewArrivalsProps) {
  const { onAdd } = props;
  const { newDishes } = useSelector(newDishesRetriever);
  const history = useHistory();

  const newProducts: Product[] = Array.isArray(newDishes) ? newDishes : [];
  const showRamMemory = (collection: ProductCollection) =>
    RAM_MEMORY_COLLECTIONS.includes(collection);

  return (
    <Box
      sx={{
        // Advertisement (padding: "0 20px 80px") dan keyin keladi
        // Yuqoridan gap bo'lsin
        pt: { xs: 8, md: 12 },
        pb: { xs: 6, md: 10 },
        background: "#060b13",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Glow */}
      <Box
        sx={{
          position: "absolute",
          top: "30%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600, height: 300,
          background: "radial-gradient(ellipse, rgba(41,121,255,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="xl">
        {/* Header — markazlashtirilgan */}
        <Stack alignItems="center" mb={5} sx={{ position: "relative" }}>
          <Box
            sx={{
              fontSize: { xs: 24, md: 32 },
              fontWeight: 900,
              color: "#fff",
              fontFamily: "'Orbitron', monospace",
              letterSpacing: -0.5,
              textAlign: "center",
            }}
          >
            New Arrivals
          </Box>
          {/* View All — o'ng tomonda absolute */}
          <Box
            onClick={() => history.push("/products")}
            sx={{
              position: "absolute", right: 0, bottom: 0,
              display: "flex", alignItems: "center", gap: 0.5,
              fontSize: 13, fontWeight: 600, color: BLUE,
              cursor: "pointer", pb: 0.3,
              borderBottom: `1px solid ${BLUE}44`,
              "&:hover": { color: "#fff", borderColor: "#fff" },
              transition: "all 0.2s",
            }}
          >
            View All
            <ArrowForwardIcon sx={{ fontSize: 16 }} />
          </Box>
        </Stack>

        {newProducts.length !== 0 ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr 1fr",
                sm: "repeat(3, 1fr)",
                md: "repeat(4, 1fr)",
                lg: "repeat(5, 1fr)",
              },
              gap: { xs: 2, md: 2.5 },
            }}
          >
            {newProducts.map((product: Product, idx: number) => {
              const productId = product._id.toString();
              const imagePath = `${serverApi}/${product.productImages[0]}`;
              const hasRamMemory = showRamMemory(product.productCollection);

              return (
                <Box
                  key={productId}
                  onClick={() => history.push(`/products/${productId}`)}
                  sx={{
                    background: BG2,
                    border: `1px solid rgba(255,255,255,0.06)`,
                    borderRadius: "14px", overflow: "hidden",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    animation: `fadeUp 0.5s ${idx * 0.07}s ease both`,
                    "@keyframes fadeUp": {
                      from: { opacity: 0, transform: "translateY(24px)" },
                      to: { opacity: 1, transform: "translateY(0)" },
                    },
                    "&:hover": {
                      border: `1px solid ${BLUE}`,
                      transform: "translateY(-4px)",
                      boxShadow: `0 12px 32px rgba(41,121,255,0.18)`,
                      "& .hover-overlay": { opacity: 1 },
                      "& .product-img": { transform: "scale(1.06)" },
                    },
                  }}
                >
                  {/* Image */}
                  <Box sx={{ position: "relative", height: { xs: 150, md: 190 }, overflow: "hidden", background: BG3 }}>
                    <Box
                      className="product-img"
                      component="img"
                      src={imagePath}
                      alt={product.productName}
                      sx={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
                    />

                    {/* NEW badge */}
                    <Box
                      sx={{
                        position: "absolute", top: 10, left: 10,
                        background: BLUE, color: "#fff",
                        fontSize: 9, fontWeight: 800, px: 1, py: 0.3,
                        borderRadius: "5px", letterSpacing: 1, textTransform: "uppercase",
                      }}
                    >
                      NEW
                    </Box>

                    {/* Rating */}
                    <Box
                      sx={{
                        position: "absolute", top: 10, right: 10,
                        background: "rgba(8,8,20,0.8)", backdropFilter: "blur(8px)",
                        border: "1px solid rgba(255,200,0,0.2)",
                        borderRadius: "7px", px: 0.8, py: 0.3,
                        display: "flex", alignItems: "center", gap: 0.3,
                      }}
                    >
                      <StarIcon sx={{ fontSize: 10, color: "#fbbf24" }} />
                      <Box sx={{ fontSize: 10, fontWeight: 700, color: "#fbbf24" }}>
                        {product.productRating?.toFixed(1) ?? "0.0"}
                      </Box>
                    </Box>

                    {/* Hover overlay */}
                    <Box
                      className="hover-overlay"
                      sx={{
                        position: "absolute", inset: 0,
                        background: "rgba(8,8,20,0.6)",
                        opacity: 0, transition: "opacity 0.3s ease",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        gap: 1.2,
                      }}
                    >
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
                          background: BLUE, color: "#fff", width: 42, height: 42,
                          boxShadow: `0 4px 16px rgba(41,121,255,0.45)`,
                          "&:hover": { background: "#1565c0", transform: "scale(1.1)" },
                          transition: "all 0.2s",
                        }}
                      >
                        <ShoppingCartOutlinedIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Info */}
                  <Box sx={{ p: { xs: 1.2, md: 1.5 } }}>
                    {product.productBrand && (
                      <Box sx={{ fontSize: 10, fontWeight: 700, color: BLUE, textTransform: "uppercase", letterSpacing: 0.5, mb: 0.3 }}>
                        {product.productBrand}
                      </Box>
                    )}

                    <Box sx={{ fontSize: { xs: 12, md: 13 }, fontWeight: 600, color: "#fff", mb: 0.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {product.productName}
                    </Box>

                    {hasRamMemory && (
                      <Stack direction="row" gap={0.8} mb={0.8} flexWrap="wrap">
                        {product.productRam && (
                          <Box sx={{ fontSize: 9, px: 0.7, py: 0.2, background: "rgba(41,121,255,0.1)", border: `1px solid ${BORDER}`, borderRadius: "4px", color: "#60a5fa" }}>
                            {product.productRam}GB RAM
                          </Box>
                        )}
                        {product.productMemory && (
                          <Box sx={{ fontSize: 9, px: 0.7, py: 0.2, background: "rgba(41,121,255,0.1)", border: `1px solid ${BORDER}`, borderRadius: "4px", color: "#60a5fa" }}>
                            {product.productMemory}GB
                          </Box>
                        )}
                      </Stack>
                    )}

                    <Stack direction="row" alignItems="center" gap={1} mb={1}>
                      <Stack direction="row" alignItems="center" gap={0.3}>
                        <FavoriteIcon sx={{ fontSize: 10, color: "#ef4444" }} />
                        <Box sx={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>
                          {product.productLikes ?? 0}
                        </Box>
                      </Stack>
                      {product.productReviewCount > 0 && (
                        <Box sx={{ fontSize: 10, color: "rgba(255,255,255,0.25)" }}>
                          {product.productReviewCount} reviews
                        </Box>
                      )}
                    </Stack>

                    <Box sx={{ fontSize: { xs: 14, md: 16 }, fontWeight: 800, color: BLUE }}>
                      ${product.productPrice.toLocaleString()}
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        ) : (
          <Stack alignItems="center" justifyContent="center" sx={{ py: 8 }}>
            <Box sx={{ fontSize: 40, opacity: 0.2, mb: 2 }}>📦</Box>
            <Box sx={{ fontSize: 14, color: "rgba(255,255,255,0.2)" }}>
              New products are not available
            </Box>
          </Stack>
        )}
      </Container>
    </Box>
  );
}
