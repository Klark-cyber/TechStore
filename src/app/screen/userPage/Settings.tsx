import { Box, Button, Stack } from "@mui/material";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import { useGlobals } from "../../hooks/useGlobals";
import { MemberUpdateInput } from "../../../lib/types/member";
import { useState } from "react";
import { T } from "../../../lib/types/common";
import { sweetErrorHandling, sweetTopSmallSuccessAlert } from "../../../lib/sweetAlert";
import { Messages, serverApi } from "../../../lib/config";
import MemberService from "../../services/MemberService";
import React from "react";

const BLUE = "#2979FF";
const BLUE_DARK = "#1565c0";
const BORDER = "rgba(41,121,255,0.15)";

const inputSx = {
  width: "100%",
  background: "rgba(255,255,255,0.04)",
  border: `1px solid rgba(255,255,255,0.1)`,
  borderRadius: "10px",
  px: "16px",
  py: "12px",
  fontSize: "14px",
  color: "#fff",
  outline: "none",
  boxSizing: "border-box" as const,
  transition: "border-color 0.2s",
  fontFamily: "inherit",
  resize: "vertical" as const,
  "&::placeholder": { color: "rgba(255,255,255,0.25)" },
};

export function Settings() {
  const { authMember, setAuthMember } = useGlobals();

  const [memberImage, setMemberimage] = useState<string>(
    authMember?.memberImage
      ? `${serverApi}/${authMember.memberImage}`
      : "/icons/default-user.svg"
  );

  const [memberUpdateInput, setmemberUpdateInput] = useState<MemberUpdateInput>({
    memberNick: authMember?.memberNick,
    memberPhone: authMember?.memberPhone,
    memberAddress: authMember?.memberAddress,
    memberDesc: authMember?.memberDesc,
    memberImage: authMember?.memberImage,
  });

  /** HANDLERS **/
  const memberNickHandler = (e: T) => {
    memberUpdateInput.memberNick = e.target.value;
    setmemberUpdateInput({ ...memberUpdateInput });
  };

  const memberPhoneHandler = (e: T) => {
    memberUpdateInput.memberPhone = e.target.value;
    setmemberUpdateInput({ ...memberUpdateInput });
  };

  const memberDescHandler = (e: T) => {
    memberUpdateInput.memberDesc = e.target.value;
    setmemberUpdateInput({ ...memberUpdateInput });
  };

  const memberAddresHandler = (e: T) => {
    memberUpdateInput.memberAddress = e.target.value;
    setmemberUpdateInput({ ...memberUpdateInput });
  };

  const handleSubmitButton = async () => {
  try {
    // ...
    const member = new MemberService();
    const result = await member.updateMember(memberUpdateInput);
    console.log("update result:", result); // ← result ichida memberAddres bormi?
    setAuthMember(result);
    await sweetTopSmallSuccessAlert("Modified successfully!", 700);
  } catch (err) {
    console.log(err);
    sweetErrorHandling(err).then();
  }
};

  const handleImageViewer = (e: T) => {
    const file = e.target.files[0];
    const fileType = file.type;
    const validateImageTypes = ["image/jpg", "image/png", "image/jpeg"];
    if (!validateImageTypes.includes(fileType)) {
      sweetErrorHandling(Messages.error5).then();
    } else {
      if (file) {
        memberUpdateInput.memberImage = file;
        setmemberUpdateInput({ ...memberUpdateInput });
        setMemberimage(URL.createObjectURL(file));
      }
    }
  };

  return (
    <Box className={"settings"}>
      <Stack spacing={3}>

        {/* Avatar upload */}
        <Stack direction="row" alignItems="center" gap={3}
          className={"member-media-frame"}
          sx={{
            background: "rgba(255,255,255,0.03)",
            border: `1px solid ${BORDER}`,
            borderRadius: "12px",
            p: 2.5,
          }}
        >
          <Box
            component="img"
            src={memberImage}
            className={"mb-image"}
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              border: `2px solid ${BLUE}`,
              objectFit: "cover",
              flexShrink: 0,
            }}
          />
          <Box className={"media-change-box"}>
            <Box sx={{ fontSize: 14, fontWeight: 600, color: "#fff", mb: 0.3 }}>
              Upload image
            </Box>
            <Box sx={{ fontSize: 12, color: "rgba(255,255,255,0.35)", mb: 1.5 }}>
              JPG, JPEG, PNG formats only!
            </Box>
            <Box className={"up-del-box"}>
              <Button
                component="label"
                onChange={handleImageViewer}
                startIcon={<CloudDownloadIcon />}
                size="small"
                sx={{
                  background: "rgba(41,121,255,0.1)",
                  border: `1px solid ${BORDER}`,
                  color: BLUE,
                  borderRadius: "8px",
                  textTransform: "none",
                  fontSize: 12,
                  fontWeight: 600,
                  px: 2,
                  "&:hover": { background: "rgba(41,121,255,0.2)" },
                }}
              >
                Choose file
                <input type="file" hidden />
              </Button>
            </Box>
          </Box>
        </Stack>

        {/* Username */}
        <Box className={"input-frame"}>
          <Box className={"long-input"}>
            <Box
              component="label"
              className={"spec-label"}
              sx={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", mb: 0.8, letterSpacing: 0.5, textTransform: "uppercase" }}
            >
              Username
            </Box>
            <Box
              component="input"
              className={"spec-input mb-nick"}
              type="text"
              placeholder={authMember?.memberNick}
              value={memberUpdateInput.memberNick}
              onChange={memberNickHandler}
              name="memberNick"
              sx={inputSx}
            />
          </Box>
        </Box>

        {/* Phone + Address */}
        <Box className={"input-frame"}>
          <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
            <Box className={"short-input"} sx={{ flex: 1 }}>
              <Box
                component="label"
                className={"spec-label"}
                sx={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", mb: 0.8, letterSpacing: 0.5, textTransform: "uppercase" }}
              >
                Phone
              </Box>
              <Box
                component="input"
                className={"spec-input mb-phone"}
                type="text"
                placeholder={authMember?.memberPhone ?? "no phone"}
                value={memberUpdateInput.memberPhone}
                onChange={memberPhoneHandler}
                name="memberPhone"
                sx={inputSx}
              />
            </Box>
            <Box className={"short-input"} sx={{ flex: 1 }}>
              <Box
                component="label"
                className={"spec-label"}
                sx={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", mb: 0.8, letterSpacing: 0.5, textTransform: "uppercase" }}
              >
                Address
              </Box>
              <Box
                component="input"
                className={"spec-input mb-address"}
                type="text"
                placeholder={authMember?.memberAddress ?? "No address"}
                value={memberUpdateInput.memberAddress}
                onChange={memberAddresHandler}
                name="memberAddress"
                sx={inputSx}
              />
            </Box>
          </Stack>
        </Box>

        {/* Description */}
        <Box className={"input-frame"}>
          <Box className={"long-input"}>
            <Box
              component="label"
              className={"spec-label"}
              sx={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", mb: 0.8, letterSpacing: 0.5, textTransform: "uppercase" }}
            >
              Description
            </Box>
            <Box
              component="textarea"
              className={"spec-textarea mb-description"}
              placeholder={authMember?.memberDesc ?? "No description"}
              value={memberUpdateInput.memberDesc}
              onChange={memberDescHandler}
              name="memberDesc"
              rows={4}
              sx={inputSx}
            />
          </Box>
        </Box>

        {/* Save button */}
        <Box className={"save-box"} sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant={"contained"}
            onClick={handleSubmitButton}
            sx={{
              background: BLUE,
              color: "#fff",
              fontWeight: 700,
              fontSize: 14,
              px: 4,
              py: 1.3,
              borderRadius: "10px",
              textTransform: "none",
              boxShadow: `0 8px 24px rgba(41,121,255,0.3)`,
              "&:hover": { background: BLUE_DARK },
            }}
          >
            Save Changes
          </Button>
        </Box>

      </Stack>
    </Box>
  );
}