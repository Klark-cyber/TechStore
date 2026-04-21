import React, { useState } from "react";
import {
  Box, Stack, Dialog, DialogTitle, DialogContent,
  DialogActions, Button, Rating,
} from "@mui/material";
import TabPanel from "@mui/lab/TabPanel";
import StarIcon from "@mui/icons-material/Star";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { Product } from "../../../lib/types/product";
import { serverApi, Messages } from "../../../lib/config";
import { retriveFinishedOrders } from "./selector";
import { Order, OrederItem } from "../../../lib/types/order";
import ProductService from "../../services/ProductService";
import { useGlobals } from "../../hooks/useGlobals";
import { sweetErrorHandling, sweetTopSmallSuccessAlert } from "../../../lib/sweetAlert";

const BLUE = "#2979FF";
const BLUE_DARK = "#1565c0";
const BORDER = "rgba(41,121,255,0.15)";
const BG_CARD = "#0d1020";

const finishedOrdersRetriever = createSelector(
  retriveFinishedOrders,
  (finishedOrders) => ({ finishedOrders })
);

export default function FinishedOrders() {
  const { finishedOrders } = useSelector(finishedOrdersRetriever);
  const { authMember } = useGlobals();

  // Rate modal state
  const [rateOpen, setRateOpen] = useState(false);
  const [ratingValue, setRatingValue] = useState<number | null>(0);
  const [ratingProduct, setRatingProduct] = useState<{ id: string; name: string } | null>(null);
  const [ratedIds, setRatedIds] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);

  const handleOpenRate = (productId: string, productName: string) => {
    setRatingProduct({ id: productId, name: productName });
    setRatingValue(0);
    setRateOpen(true);
  };

  const handleCloseRate = () => {
    setRateOpen(false);
    setRatingProduct(null);
    setRatingValue(0);
  };

  const handleSubmitRate = async () => {
    try {
      if (!authMember) throw new Error(Messages.error2);
      if (!ratingProduct || !ratingValue) return;

      setSubmitting(true);
      const service = new ProductService();
      await service.rateProduct({ productId: ratingProduct.id, rating: ratingValue });

      // Rated deb belgilab qo'yamiz — qayta rate bosishni oldini olish
      setRatedIds((prev) => new Set(prev).add(ratingProduct.id));
      handleCloseRate();
      await sweetTopSmallSuccessAlert("Thank you for your rating!", 1500);
    } catch (err: any) {
      sweetErrorHandling(err).then();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <TabPanel value="3" sx={{ p: 3 }}>
      <Stack spacing={2}>

        {finishedOrders?.map((order: Order) => (
          <Box
            key={(order._id as unknown) as string}
            className="order-main-box"
            sx={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(34,197,94,0.2)",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            {/* DELIVERED badge */}
            <Stack direction="row" alignItems="center" gap={1} sx={{
              px: 2, py: 1.2,
              background: "rgba(34,197,94,0.08)",
              borderBottom: "1px solid rgba(34,197,94,0.15)",
            }}>
              <CheckCircleIcon sx={{ fontSize: 16, color: "#22c55e" }} />
              <Box sx={{ fontSize: 12, fontWeight: 600, color: "#22c55e", letterSpacing: 0.5 }}>
                DELIVERED
              </Box>
            </Stack>

            {/* Order items */}
            <Box className="order-box-scroll" sx={{ p: 2 }}>
              {order?.orderItems?.map((item: OrederItem) => {
                const product: Product = order.productData.filter(
                  (ele: Product) => item.productId === ele._id
                )[0];
                const imagePath = `${serverApi}/${product?.productImages?.[0]}`;
                const productId = String(product?._id);
                const alreadyRated = ratedIds.has(productId);

                return (
                  <Stack
                    key={(item._id as unknown) as string}
                    direction="row"
                    alignItems="center"
                    gap={2}
                    sx={{
                      py: 1.5,
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                      "&:last-child": { borderBottom: "none" },
                    }}
                  >
                    {/* Product image */}
                    <Box
                      component="img"
                      src={imagePath}
                      sx={{
                        width: 64, height: 64, borderRadius: "10px",
                        objectFit: "cover", background: "#111827", flexShrink: 0,
                      }}
                    />

                    {/* Product info */}
                    <Box flex={1} minWidth={0}>
                      <Box sx={{
                        fontSize: 14, fontWeight: 600, color: "#fff",
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", mb: 0.5,
                      }}>
                        {product?.productName}
                      </Box>
                      <Stack direction="row" alignItems="center" gap={1}>
                        <Box sx={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
                          ${item.itemPrice}
                        </Box>
                        <Box sx={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>×</Box>
                        <Box sx={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
                          {item.itemQuantity}
                        </Box>
                        <Box sx={{ fontSize: 13, fontWeight: 700, color: BLUE, ml: "auto" }}>
                          ${item.itemQuantity * item.itemPrice}
                        </Box>
                      </Stack>
                    </Box>

                    {/* Rate button */}
                    <Button
                      size="small"
                      startIcon={<StarIcon sx={{ fontSize: 14 }} />}
                      onClick={() => handleOpenRate(productId, product?.productName)}
                      disabled={alreadyRated}
                      sx={{
                        flexShrink: 0,
                        fontSize: 11, fontWeight: 600,
                        textTransform: "none",
                        borderRadius: "8px",
                        px: 1.5, py: 0.6,
                        background: alreadyRated
                          ? "rgba(255,255,255,0.05)"
                          : "rgba(251,191,36,0.1)",
                        border: `1px solid ${alreadyRated ? "rgba(255,255,255,0.08)" : "rgba(251,191,36,0.3)"}`,
                        color: alreadyRated ? "rgba(255,255,255,0.3)" : "#fbbf24",
                        "&:hover": {
                          background: alreadyRated ? "rgba(255,255,255,0.05)" : "rgba(251,191,36,0.2)",
                        },
                        "&.Mui-disabled": {
                          color: "rgba(255,255,255,0.2)",
                        },
                      }}
                    >
                      {alreadyRated ? "Rated" : "Rate"}
                    </Button>
                  </Stack>
                );
              })}
            </Box>

            {/* Total */}
            <Box sx={{
              px: 2, py: 2,
              background: "rgba(34,197,94,0.04)",
              borderTop: "1px solid rgba(34,197,94,0.15)",
            }}>
              <Stack direction="row" gap={3}>
                <Box>
                  <Box sx={{ fontSize: 11, color: "rgba(255,255,255,0.35)", mb: 0.3 }}>Subtotal</Box>
                  <Box sx={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>
                    ${order.orderTotal - order.orderDelivery}
                  </Box>
                </Box>
                <Box>
                  <Box sx={{ fontSize: 11, color: "rgba(255,255,255,0.35)", mb: 0.3 }}>Shipping</Box>
                  <Box sx={{
                    fontSize: 14, fontWeight: 600,
                    color: order.orderDelivery === 0 ? "#22c55e" : "#fff",
                  }}>
                    {order.orderDelivery === 0 ? "FREE" : `$${order.orderDelivery}`}
                  </Box>
                </Box>
                <Box>
                  <Box sx={{ fontSize: 11, color: "rgba(255,255,255,0.35)", mb: 0.3 }}>Total</Box>
                  <Box sx={{ fontSize: 16, fontWeight: 800, color: BLUE }}>
                    ${order.orderTotal}
                  </Box>
                </Box>
              </Stack>
            </Box>
          </Box>
        ))}

        {/* Empty state */}
        {(!finishedOrders || finishedOrders.length === 0) && (
          <Stack alignItems="center" justifyContent="center" py={6}>
            <img src="/icons/noimage-list.svg" alt="No orders" style={{ width: 120, height: 120, opacity: 0.3 }} />
            <Box sx={{ mt: 2, fontSize: 14, color: "rgba(255,255,255,0.25)" }}>
              No finished orders
            </Box>
          </Stack>
        )}
      </Stack>

      {/* ── Rate Modal ── */}
      <Dialog
        open={rateOpen}
        onClose={handleCloseRate}
        PaperProps={{
          sx: {
            background: BG_CARD,
            border: `1px solid ${BORDER}`,
            borderRadius: "16px",
            minWidth: 340,
            p: 1,
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" alignItems="center" gap={1}>
            <StarIcon sx={{ color: "#fbbf24", fontSize: 22 }} />
            <Box sx={{
              fontSize: 16, fontWeight: 700, color: "#fff",
              fontFamily: "'Orbitron', monospace",
            }}>
              Rate Product
            </Box>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ pb: 1 }}>
          {/* Product name */}
          <Box sx={{
            fontSize: 13, color: "rgba(255,255,255,0.5)",
            mb: 3, lineHeight: 1.5,
          }}>
            {ratingProduct?.name}
          </Box>

          {/* Stars */}
          <Stack alignItems="center" gap={1}>
            <Rating
              value={ratingValue}
              onChange={(_, newValue) => setRatingValue(newValue)}
              size="large"
              precision={1}
              sx={{
                "& .MuiRating-iconFilled": { color: "#fbbf24" },
                "& .MuiRating-iconHover": { color: "#f59e0b" },
                "& .MuiRating-iconEmpty": { color: "rgba(255,255,255,0.15)" },
                fontSize: 42,
              }}
            />
            <Box sx={{ fontSize: 13, color: "rgba(255,255,255,0.4)", mt: 0.5 }}>
              {ratingValue === 1 && "Poor"}
              {ratingValue === 2 && "Fair"}
              {ratingValue === 3 && "Good"}
              {ratingValue === 4 && "Very Good"}
              {ratingValue === 5 && "Excellent"}
              {!ratingValue && "Select a rating"}
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={handleCloseRate}
            sx={{
              color: "rgba(255,255,255,0.4)",
              textTransform: "none", fontSize: 13,
              border: `1px solid ${BORDER}`, borderRadius: "8px",
              px: 2,
              "&:hover": { background: "rgba(255,255,255,0.05)" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmitRate}
            disabled={!ratingValue || submitting}
            variant="contained"
            sx={{
              background: BLUE, color: "#fff",
              textTransform: "none", fontSize: 13,
              fontWeight: 700, borderRadius: "8px",
              px: 3,
              "&:hover": { background: BLUE_DARK },
              "&.Mui-disabled": {
                background: "rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.2)",
              },
            }}
          >
            {submitting ? "Submitting..." : "Submit Rating"}
          </Button>
        </DialogActions>
      </Dialog>
    </TabPanel>
  );
}