import { Box } from "@mui/material";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import Button from "@mui/material/Button";
import { useGlobals } from "../../hooks/useGlobals";
import { MemberUpdateInput } from "../../../lib/types/member";
import { useState } from "react";
import { T } from "../../../lib/types/common";
import { sweetErrorHandling, sweetTopSmallSuccessAlert } from "../../../lib/sweetAlert";
import { Message } from "@mui/icons-material";
import { Messages, serverApi } from "../../../lib/config";
import MemberService from "../../services/MemberService";

export function Settings() {

const {authMember, setAuthMember} = useGlobals();
const [memberImage, setMemberimage] = useState<string>(
  (authMember?.memberImage ? `${serverApi}/${authMember.memberImage}` : "/icons/default-user.svg")
)
const [memberUpdateInput, setmemberUpdateInput] = useState<MemberUpdateInput>(
  {
      memberNick: authMember?.memberNick,
      memberPhone: authMember?.memberPhone,
      memberAddres: authMember?.memberAddres,
      memberDesc: authMember?.memberDesc,
      memberImage: authMember?.memberImage
  }
);
// HANDLERS
const memberNickHandler = (e: T) => {
  memberUpdateInput.memberNick = e.target.value;
  setmemberUpdateInput({...memberUpdateInput});
}

const memberPhoneHandler = (e: T) => {
  memberUpdateInput.memberPhone = e.target.value;
  setmemberUpdateInput({...memberUpdateInput});
}

const memberDescHandler = (e: T) => {
  memberUpdateInput.memberDesc = e.target.value;
  setmemberUpdateInput({...memberUpdateInput});
}

const memberAddresHandler = (e: T) => {
  memberUpdateInput.memberAddres = e.target.value;
  setmemberUpdateInput({...memberUpdateInput});
}

const handleSubmitButton = async () => {
  try{
    if(!authMember) throw new Error(Messages.error2)
    if(memberUpdateInput.memberNick === "" 
      || memberUpdateInput.memberPhone === "" 
      || memberUpdateInput.memberDesc === "" 
      || memberUpdateInput.memberAddres === ""
    ){
      throw new Error(Messages.error3);
    }

    const member = new MemberService();
    const result = await member.updateMember(memberUpdateInput);
    setAuthMember(result);

    await sweetTopSmallSuccessAlert("Modifieed successfully!", 700)
  }catch(err) {
    console.log(err);
    sweetErrorHandling(err).then();
  }
}

//user rasmni ozgartirmoqchi bolsa avval ram qay holatda korinishi tekshirish mantigi
const handleImageViewer = (e: T) => {
  const file = e.target.files[0];
  console.log("file: ", file)
  const fileType = file.type;
  const validateImageTypes = ["image/jpg", "image/png", "image/jpeg"];

  if(!validateImageTypes.includes(fileType)) {
    sweetErrorHandling(Messages.error5).then();
}else{
    if(file) {
      memberUpdateInput.memberImage = file;
      setmemberUpdateInput({...memberUpdateInput});
      setMemberimage(URL.createObjectURL(file)); //eski rasmni yangisiga almashtiramiz.MemberImage yangilanadi va avtomatik refresh bolib 92 qatordagi rasm yangilanadi
    }
}
}

  return (
    <Box className={"settings"}>
      <Box className={"member-media-frame"}>
        <img src={memberImage} 
        className={"mb-image"} />
        <div className={"media-change-box"}>
          <span>Upload image</span>
          <p>JPG, JPEG, PNG formats only!</p>
          <div className={"up-del-box"}>
            <Button 
            component="label"
            onChange={handleImageViewer}>
              <CloudDownloadIcon />
              <input type="file" hidden />
            </Button>
          </div>
        </div>
      </Box>
      <Box className={"input-frame"}>
        <div className={"long-input"}>
          <label className={"spec-label"}>Username</label>
          <input
            className={"spec-input mb-nick"}
            type="text"
            placeholder={authMember?.memberNick}
            value={memberUpdateInput.memberNick}
            onChange={memberNickHandler}
            name="memberNick"
          />
        </div>
      </Box>
      <Box className={"input-frame"}>
        <div className={"short-input"}>
          <label className={"spec-label"}>Phone</label>
          <input
            className={"spec-input mb-phone"}
            type="text"
            placeholder={authMember?.memberPhone ? authMember.memberPhone : "no phone"}
            value={memberUpdateInput.memberPhone}
            onChange={memberPhoneHandler}
            name="memberPhone"
          />
        </div>
        <div className={"short-input"}>
          <label className={"spec-label"}>Address</label>
          <input
            className={"spec-input  mb-address"}
            type="text"
            placeholder={authMember?.memberAddres ? authMember.memberAddres : "No adress"}
            value={memberUpdateInput.memberAddres}
            onChange={memberAddresHandler}
            name="memberAddress"
          />
        </div>
      </Box>
      <Box className={"input-frame"}>
        <div className={"long-input"}>
          <label className={"spec-label"}>Description</label>
          <textarea
            className={"spec-textarea mb-description"}
            placeholder={authMember?.memberDesc ? authMember.memberDesc : "No description"}
            value={memberUpdateInput.memberDesc}
            onChange={memberDescHandler}
            name="memberDesc"
          />
        </div>
      </Box>
      <Box className={"save-box"}>
        <Button 
        variant={"contained"} 
        onClick={handleSubmitButton} 
        >Save</Button>
      </Box>
    </Box>
  );
}
