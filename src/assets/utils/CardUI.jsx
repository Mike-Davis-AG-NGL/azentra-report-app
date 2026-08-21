// import React from 'react'
import { useNavigate } from "react-router-dom"
import { COLORS } from "./colors"
import { Box, Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Typography } from "@mui/material"

export const CardUI = ({ img, title, subtitle, name1, name2, path1, path2 }) => {
  const navigate = useNavigate()
  return (
    <Card sx={{ width: 345 }}>
      <CardActionArea>
        <CardMedia component="img" image={img} alt="Image in Card" />
        <CardContent>
          <Typography sx={{
            fontWeight: 'bolder', fontStyle: 'italic', color: COLORS.primaryText,
            fontSize: { lg: 30, md: 25, sm: 25, xs: 25 }, textAlign: 'center'
          }}>
            {title}
          </Typography>
          <Typography sx={{
            fontWeight: 'bolder', fontStyle: 'italic', color: COLORS.secondaryText,
            fontSize: { lg: 20, md: 15, sm: 15, xs: 15 }, textAlign: 'center'
          }}>
            {subtitle}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Box>
          <Button size="small" sx={{ color: COLORS.secondaryText, mr: 2 }} onClick={() => navigate(path1)}>{name1}</Button>
          <Button size="small" sx={{ color: COLORS.secondaryText }} onClick={() => navigate(path2)}>{name2}</Button>
        </Box>
      </CardActions>
    </Card>
  )
}
