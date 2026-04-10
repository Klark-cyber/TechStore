import { Box, Container, Stack } from "@mui/material";
import Card from "@mui/joy/Card";
import { CssVarsProvider, Typography } from "@mui/joy";
import CardOverflow from "@mui/joy/CardOverflow";
import AspectRatio from "@mui/joy/AspectRatio";

import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { serverApi } from "../../../lib/config";
import { retriveTopUsers } from "./selector";


/** REDUX SLICE & SELECTOR */
//Storega slice orqali yuklangan datani chaqirib olamiz
const topUsersRetriever = createSelector(
  retriveTopUsers, 
  (topUsers) => ({topUsers}))



export default function ActiveUsers() {
  const {topUsers} = useSelector(topUsersRetriever);

  return (
    <div className={"active-users-frame"}>
      <Container>
        <Stack className={"main"}>
          <Box className={"category-title"}>Active Users</Box>
          <Stack className={"cards-frame"}>
            <CssVarsProvider>
             {topUsers.length !== 0 ? (
                topUsers.map((member) => {
            const imagePath = `${serverApi}/${member.memberImage}`;
                  return (
                    <Card key={member._id} variant="outlined" className={"card"}>
  <CardOverflow className="card-image">
    <AspectRatio ratio="1">
      <img src={imagePath} alt="" />
    </AspectRatio>
  </CardOverflow>

  {/* ALohida pastki blok */}
  <Box className="card-footer">
    <Typography className="member-nickname">
      {member.memberNick}
    </Typography>
  </Box>
</Card>
                  );
                })
              ) : (
                <Box className="no-data">No Active Users!</Box>
              )}
            </CssVarsProvider>
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}