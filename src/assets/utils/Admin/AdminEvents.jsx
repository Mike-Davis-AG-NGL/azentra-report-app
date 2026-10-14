// import React from 'react'

import { Box, Button, Card, CardActions, CardContent, Chip, Divider, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material"
import { UseTheme } from "../../Controllers/UseTheme"
import { ButtonX } from "../ButtonX"
import { ButtonXS } from "../ButtonXS"
import { Search } from "@mui/icons-material"
import { useState } from "react"

export const AdminEvents = () => {
  const theme = UseTheme()

  const [eventType, setEventType] = useState('');
  const [college, setCollege] = useState('')
  const [status, setStatus] = useState('')

  const handleChangeEventType = (e) => setEventType(e.target.value)
  const handleChangeCollege = (e) => setCollege(e.target.value)
  const handleChangeStatus = (e) => setStatus(e.target.value)

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100dvh', height: 'auto', overflowY: 'auto', }}>
      <Grid container>
        <Grid size={12}>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container>
              <Grid size={{ lg: 6, md: 6, sm: 12, xs: 12 }}>
                <Box
                  sx={{
                    display: 'flex', jalignItems: { lg: 'left', md: 'left', sm: 'center', xs: 'center' },
                    justifyContent: 'center', flexDirection: 'column', p: 2
                  }}>
                  <Typography variant="h5" sx={{ color: theme.primaryText, fontWeight: 'bold' }}>
                    Events
                  </Typography>
                  <Typography sx={{ color: theme.secondaryText }}>
                    Create and Manage Workshops and Courses
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ lg: 6, md: 6, sm: 12, xs: 12 }}>
                <Box sx={{ display: { lg: 'flex', md: 'flex', sm: 'none', xs: 'none' }, justifyContent: 'right', alignItems: 'center', p: 2 }}>
                  <ButtonX name={'Create Event'} />
                </Box>
                <Box sx={{ display: { lg: 'none', md: 'none', sm: 'flex', xs: 'flex' }, justifyContent: 'center', alignItems: 'center' }}>
                  <ButtonXS name={'Create Event'} />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid size={12}>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container>
              <Grid size={12}>
                <Box sx={{ flexGrow: 1 }}>
                  <Grid container>
                    <Grid size={{ lg: 6, md: 6, sm: 12, xs: 12 }}>
                      <Box sx={{ pt: 2, pl: 2, pr: { lg: 0, md: 0, sm: 2, xs: 2 } }}>
                        <Card sx={{ bgcolor: theme.cardBg, borderColor: theme.cardBorder }}>
                          <Box
                            sx={{
                              display: 'flex', jalignItems: { lg: 'left', md: 'left', sm: 'center', xs: 'center' },
                              justifyContent: 'center', flexDirection: 'column', p: 2
                            }}>
                            <Typography sx={{ color: theme.secondaryText }}>
                              Total Events
                            </Typography>
                            <Typography variant="h3" sx={{ color: theme.primaryText, fontWeight: 'bold' }}>
                              24
                            </Typography>
                          </Box>
                        </Card>
                      </Box>
                    </Grid>
                    <Grid size={{ lg: 6, md: 6, sm: 12, xs: 12 }}>
                      <Box sx={{ pt: 2, pl: 2, pr: 2 }}>
                        <Card sx={{ bgcolor: theme.cardBg, borderColor: theme.cardBorder }}>
                          <Box
                            sx={{
                              display: 'flex', jalignItems: { lg: 'left', md: 'left', sm: 'center', xs: 'center' },
                              justifyContent: 'center', flexDirection: 'column', p: 2
                            }}>
                            <Typography sx={{ color: theme.secondaryText }}>
                              Upcoming
                            </Typography>
                            <Typography variant="h3" sx={{ color: theme.primaryText, fontWeight: 'bold' }}>
                              8
                            </Typography>
                          </Box>
                        </Card>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              <Grid size={12}>
                <Box sx={{ flexGrow: 1 }}>
                  <Grid container>
                    <Grid size={{ lg: 6, md: 6, sm: 12, xs: 12 }}>
                      <Box sx={{ pt: 2, pl: 2, pb: 2, pr: { lg: 0, md: 0, sm: 2, xs: 2 } }}>
                        <Card sx={{ bgcolor: theme.cardBg, borderColor: theme.cardBorder }}>
                          <Box
                            sx={{
                              display: 'flex', jalignItems: { lg: 'left', md: 'left', sm: 'center', xs: 'center' },
                              justifyContent: 'center', flexDirection: 'column', p: 2
                            }}>
                            <Typography sx={{ color: theme.secondaryText }}>
                              Completed
                            </Typography>
                            <Typography variant="h3" sx={{ color: theme.primaryText, fontWeight: 'bold' }}>
                              12
                            </Typography>
                          </Box>
                        </Card>
                      </Box>
                    </Grid>
                    <Grid size={{ lg: 6, md: 6, sm: 12, xs: 12 }}>
                      <Box sx={{ p: 2 }}>
                        <Card sx={{ bgcolor: theme.cardBg, borderColor: theme.cardBorder }}>
                          <Box
                            sx={{
                              display: 'flex', jalignItems: { lg: 'left', md: 'left', sm: 'center', xs: 'center' },
                              justifyContent: 'center', flexDirection: 'column', p: 2
                            }}>
                            <Typography sx={{ color: theme.secondaryText }}>
                              Drafts
                            </Typography>
                            <Typography variant="h3" sx={{ color: theme.primaryText, fontWeight: 'bold' }}>
                              4
                            </Typography>
                          </Box>
                        </Card>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid size={12}>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container>
              <Grid size={12}>
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ color: theme.primaryText, fontWeight: 'bold' }}>
                    Search and Filters
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ lg: 6, md: 6, sm: 12, xs: 12 }}>
                <Box sx={{ pl: 2, pr: { lg: 1, md: 1, sm: 2, xs: 2 }, pb: { lg: 0, md: 0, sm: 2, xs: 2 } }}>
                  <TextField variant="outlined" fullWidth placeholder="Search"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search sx={{ color: theme.secondaryText }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: theme.primaryText,
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: theme.primaryAccent,
                          borderWidth: "2px",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: theme.primaryAccent,
                          borderWidth: "2px",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: theme.primaryAccent,
                          borderWidth: "2px",
                        },
                      },
                      "& .MuiInputBase-input::placeholder": {
                        color: theme.secondaryText,
                        opacity: 1,
                      },
                    }} />
                </Box>
              </Grid>
              <Grid size={{ lg: 2, md: 2, sm: 4, xs: 4 }}>
                <Box sx={{ pl: { lg: 1, md: 1, sm: 2, xs: 2 }, pr: 1, pb: { lg: 0, md: 0, sm: 2, xs: 2 } }}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label"
                      sx={{
                        color: theme.secondaryText,
                        "&.Mui-focused": {
                          color: theme.primaryAccent,
                        },
                      }}
                    >Event Type</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={eventType}
                      label="Event Type"
                      onChange={handleChangeEventType}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            bgcolor: theme.cardBg,
                            border: `1px solid ${theme.cardBorder}`,
                            "& .MuiMenuItem-root": {
                              color: theme.primaryText,
                              "&:hover": {
                                bgcolor: theme.background,
                              },
                              "&.Mui-selected": {
                                bgcolor: theme.primaryAccent,
                                color: theme.primaryText,
                              },
                              "&.Mui-selected:hover": {
                                bgcolor: theme.primaryAccent,
                              },
                            },
                          },
                        },
                      }}
                      sx={{
                        color: theme.primaryText,
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: theme.primaryAccent,
                          borderWidth: "2px",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: theme.primaryAccent,
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: theme.primaryAccent,
                        },
                        "& .MuiSvgIcon-root": {
                          color: theme.secondaryText,
                        },
                      }}
                    >
                      <MenuItem value={10}>Ten</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
              <Grid size={{ lg: 2, md: 2, sm: 4, xs: 4 }}>
                <Box sx={{ pl: 1, pr: 1, pb: { lg: 0, md: 0, sm: 2, xs: 2 } }}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label"
                      sx={{
                        color: theme.secondaryText,
                        "&.Mui-focused": {
                          color: theme.primaryAccent,
                        },
                      }}
                    >College</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={college}
                      label="College"
                      onChange={handleChangeCollege}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            bgcolor: theme.cardBg,
                            border: `1px solid ${theme.cardBorder}`,
                            "& .MuiMenuItem-root": {
                              color: theme.primaryText,
                              "&:hover": {
                                bgcolor: theme.background,
                              },
                              "&.Mui-selected": {
                                bgcolor: theme.primaryAccent,
                                color: theme.primaryText,
                              },
                              "&.Mui-selected:hover": {
                                bgcolor: theme.primaryAccent,
                              },
                            },
                          },
                        },
                      }}
                      sx={{
                        color: theme.primaryText,
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: theme.primaryAccent,
                          borderWidth: "2px",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: theme.primaryAccent,
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: theme.primaryAccent,
                        },
                        "& .MuiSvgIcon-root": {
                          color: theme.secondaryText,
                        },
                      }}
                    >
                      <MenuItem value={10}>Ten</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
              <Grid size={{ lg: 2, md: 2, sm: 4, xs: 4 }}>
                <Box sx={{ pl: 1, pr: 2, pb: { lg: 0, md: 0, sm: 2, xs: 2 } }}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label"
                      sx={{
                        color: theme.secondaryText,
                        "&.Mui-focused": {
                          color: theme.primaryAccent,
                        },
                      }}
                    >Status</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={status}
                      label="Status"
                      onChange={handleChangeStatus}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            bgcolor: theme.cardBg,
                            border: `1px solid ${theme.cardBorder}`,
                            "& .MuiMenuItem-root": {
                              color: theme.primaryText,
                              "&:hover": {
                                bgcolor: theme.background,
                              },
                              "&.Mui-selected": {
                                bgcolor: theme.primaryAccent,
                                color: theme.primaryText,
                              },
                              "&.Mui-selected:hover": {
                                bgcolor: theme.primaryAccent,
                              },
                            },
                          },
                        },
                      }}
                      sx={{
                        color: theme.primaryText,
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: theme.primaryAccent,
                          borderWidth: "2px",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: theme.primaryAccent,
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: theme.primaryAccent,
                        },
                        "& .MuiSvgIcon-root": {
                          color: theme.secondaryText,
                        },
                      }}
                    >
                      <MenuItem value={10}>Ten</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ p: 2 }}>
            <Divider sx={{ borderColor: theme.cardBorder, p: 1 }} />
          </Box>
        </Grid>
        <Grid size={12}>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container>
              <Grid size={12}>
                <Box sx={{ pl: 2 }}>
                  <Typography variant="h6" sx={{ color: theme.primaryText, fontWeight: 'bold' }}>
                    Events List
                  </Typography>
                </Box>
              </Grid>
              <Grid size={12}>
                <Box sx={{ p: 2 }}>
                  <Card variant="outlined" sx={{ bgcolor: theme.cardBg, borderColor: theme.cardBorder }}>
                    <CardContent>
                      <Typography sx={{ color: theme.primaryText, fontWeight: 'bold', fontSize: '18px' }}>
                        AI & Machine Learning Workshop
                      </Typography>
                      <Typography sx={{ color: theme.primaryText }}>
                        Workshop
                      </Typography>
                      <Typography sx={{ color: theme.primaryText }}>
                        Test Engineering College
                      </Typography>
                      <Typography sx={{ color: theme.primaryText }}>
                        20 OCT 2026 to 22 OCT 2026
                      </Typography>
                      <Box sx={{pt:1}}>
                        <Chip label={"Upcoming"} sx={{background: theme.primaryAccent}}/>
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button>View</Button>
                      <Button>Edit</Button>
                      <Button>Delete</Button>
                    </CardActions>
                  </Card>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}
