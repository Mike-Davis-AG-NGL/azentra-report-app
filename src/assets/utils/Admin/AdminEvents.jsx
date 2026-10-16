// import React from 'react'

import {
  Box, Button, Card, CardActions, CardContent, Chip, Divider, FormControl,
  Grid, InputAdornment, InputLabel, MenuItem, Select, TextField, Typography,
  CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions,
  Snackbar, Alert,
  Backdrop
} from "@mui/material"
import { UseTheme } from "../../Controllers/UseTheme"
import { ButtonX } from "../ButtonX"
import { ButtonXS } from "../ButtonXS"
import { Search } from "@mui/icons-material"
import { useCallback, useEffect, useMemo, useState } from "react"
import axios from "axios"
import { FormEventAdmin } from "./FormEventAdmin"

export const AdminEvents = () => {
  const theme = UseTheme()

  const getEventChipStyles = (value) => {
    const chipColors = {
      Draft: {
        backgroundColor: "#FFF3E0",
        color: "#E65100",
        borderColor: "#FFCC80",
      },
      Published: {
        backgroundColor: "#E8F5E9",
        color: "#2E7D32",
        borderColor: "#A5D6A7",
      },
      Completed: {
        backgroundColor: "#E0F7FA",
        color: "#00838F",
        borderColor: "#80DEEA",
      },
      Cancelled: {
        backgroundColor: "#FFEBEE",
        color: "#C62828",
        borderColor: "#EF9A9A",
      },
    };

    return {
      ...chipColors[value],
      fontWeight: "bold",
      border: "1px solid",
    };
  };

  const [eventType, setEventType] = useState('');
  const [college, setCollege] = useState('')
  const [trainers, setTrainers] = useState([])
  const [status, setStatus] = useState('')

  const [events, setEvents] = useState([])
  const [colleges, setColleges] = useState([])
  const [departments, setDepartments] = useState([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  const [formOpen, setFormOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [viewEvent, setViewEvent] = useState(null)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [eventToDelete, setEventToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // snackbar
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleCloseSnackbar = (_, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  const handleChangeEventType = (e) => setEventType(e.target.value)
  const handleChangeCollege = (e) => setCollege(e.target.value)
  const handleChangeStatus = (e) => setStatus(e.target.value)

  const loadData = useCallback(async () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token")
    try {
      setLoading(true)
      const [eventRes, collegeRes, departmentRes, trainerRes] = await Promise.all([
        axios.get('http://localhost:5000/api/events/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }),
        axios.get('http://localhost:5000/api/college/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }),
        axios.get('http://localhost:5000/api/department/active', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }),
        axios.get('http://localhost:5000/api/auth/trainer/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      ])
      setEvents(eventRes.data.events || [])
      setColleges(collegeRes.data.colleges || [])
      setDepartments(departmentRes.data.departments || [])
      setTrainers(trainerRes.data.trainers || [])
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load events")
      setSuccess("")
      setOpenSnackbar(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const handleCreate = () => {
    setSelectedEvent(null)
    setFormOpen(true)
  }

  const handleEdit = (e) => {
    setSelectedEvent(e)
    setFormOpen(true)
  }

  const handleDelete = async () => {
    if (!eventToDelete) return
    const token = localStorage.getItem("token") || sessionStorage.getItem("token")

    try {
      setDeleting(true)

      const response = await axios.delete(
        `http://localhost:5000/api/events/delete/${eventToDelete.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setDeleteOpen(false)
      setEventToDelete(null)
      setSuccess(response.data.message || "Event deleted successfully")
      setError("")
      setOpenSnackbar(true)
      await loadData()
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete event")
      setSuccess("")
      setOpenSnackbar(true)
    } finally {
      setDeleting(false)
    }
  }

  const filteredEvents = useMemo(() => {
    const term = search.trim().toLowerCase()

    return events.filter((event) =>
      (!term ||
        event.event_name?.toLowerCase().includes(term) ||
        event.college_name?.toLowerCase().includes(term) ||
        event.department_name?.toLowerCase().includes(term)) &&
      (!eventType || event.event_type === eventType) &&
      (!college || String(event.college_id) === String(college)) &&
      (!status || event.event_status === status)
    )
  }, [events, search, eventType, college, status])

  const today = new Date().toISOString().slice(0, 10)
  const upcomingCount = events.filter((e) => e.event_status === "Published" && e.start_date >= today).length
  const completedCount = events.filter((e) => e.event_status === "Completed").length
  const draftCount = events.filter((event) => event.event_status === "Draft").length

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100dvh', height: 'auto', overflowY: 'auto', }}>
      <Grid container>
        <Grid size={12}>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container>
              <Grid size={{ lg: 6, md: 6, sm: 12, xs: 12 }}>
                <Box
                  sx={{
                    display: 'flex', alignItems: { lg: 'flex-start', md: 'flex-start', sm: 'center', xs: 'center' }, flexDirection: 'column', p: 2
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
                  <ButtonX name={'Create Event'} onClick={handleCreate} />
                </Box>
                <Box sx={{ display: { lg: 'none', md: 'none', sm: 'flex', xs: 'flex' }, justifyContent: 'center', alignItems: 'center' }}>
                  <ButtonXS name={'Create Event'} onClick={handleCreate} />
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
                              {events.length}
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
                              {upcomingCount}
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
                              {completedCount}
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
                              {draftCount}
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
                  <TextField variant="outlined" fullWidth placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)}
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
                                color: theme.selectText,
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
                      <MenuItem value="">All Events</MenuItem>
                      <MenuItem value="Workshop">Workshop</MenuItem>
                      <MenuItem value="Course">Course</MenuItem>
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
                                color: theme.selectText,
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
                      <MenuItem value="">All Colleges</MenuItem>
                      {colleges.map((item) => (
                        <MenuItem key={item.id} value={String(item.id)}>
                          {item.college_name}
                        </MenuItem>
                      ))}
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
                                color: theme.selectText,
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
                      <MenuItem value="">All Statuses</MenuItem>
                      <MenuItem value="Draft">Draft</MenuItem>
                      <MenuItem value="Published">Published</MenuItem>
                      <MenuItem value="Completed">Completed</MenuItem>
                      <MenuItem value="Cancelled">Cancelled</MenuItem>
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
                <Box sx={{ py: 1, px: 2 }}>
                  <Typography variant="h6" sx={{ color: theme.primaryText, fontWeight: 'bold' }}>
                    Events List
                  </Typography>
                </Box>
              </Grid>
              <Grid size={12}>
                {loading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : filteredEvents.length === 0 ? (
                  <Typography sx={{ color: theme.secondaryText, p: 2 }}>
                    No events found.
                  </Typography>
                ) : (
                  filteredEvents.map((event) => (
                    <Box sx={{ py: 1, px: 2 }} key={event.id}>
                      <Card
                        variant="outlined"
                        sx={{ bgcolor: theme.cardBg, borderColor: theme.cardBorder }}
                      >
                        <CardContent>
                          <Typography sx={{ color: theme.primaryText, fontWeight: "bold", fontSize: 18 }}>
                            {event.event_name}
                          </Typography>
                          <Typography sx={{ color: theme.primaryText }}>
                            {event.event_type} by {event.trainer_name || "Azentra Global"}
                          </Typography>
                          <Typography sx={{ color: theme.primaryText }}>
                            {event.college_name}
                          </Typography>
                          <Typography sx={{ color: theme.primaryText }}>
                            {event.start_date} to {event.end_date}
                          </Typography>
                          <Chip
                            label={event.event_status}
                            size="small"
                            sx={{
                              ...getEventChipStyles(event.event_status),
                              mt: 1,
                            }}
                          />
                        </CardContent>
                        <CardActions>
                          <Button onClick={() => setViewEvent(event)}
                            sx={{ color: theme.secondaryText }}>View</Button>
                          <Button onClick={() => handleEdit(event)}
                            sx={{ color: theme.secondaryText }}>Edit</Button>
                          <Button onClick={() => {
                            setEventToDelete(event)
                            setDeleteOpen(true)
                          }} sx={{ color: theme.error }}>Delete</Button>
                        </CardActions>
                      </Card>
                    </Box>
                  ))
                )}
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
      <Backdrop
        sx={{ color: theme.primaryText, zIndex: (themes) => themes.zIndex.drawer + 1, overflowY: "auto", p: 2, }}
        open={formOpen} onClick={() => setFormOpen(false)}
      >
        <Box
          onClick={(e) => e.stopPropagation()}
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FormEventAdmin
            event={selectedEvent}
            colleges={colleges}
            departments={departments}
            trainers={trainers}
            onClose={() => setFormOpen(false)}
            onUpdated={loadData}
          />
        </Box>
      </Backdrop>
      <Backdrop
        sx={{ color: theme.primaryText, zIndex: (themes) => themes.zIndex.drawer + 1, }}
        open={deleteOpen} onClick={() => {
          if (!deleting) {
            setDeleteOpen(false)
            setEventToDelete(null)
          }
        }}
      >
        <Card
          onClick={(e) => e.stopPropagation()}
          sx={{
            p: 3,
            minWidth: 280,
            maxWidth: "90vw",
            bgcolor: theme.cardBg,
            color: theme.primaryText,
            border: `1px solid ${theme.cardBorder}`,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Delete Event
          </Typography>

          <Typography sx={{ mb: 3, color: theme.secondaryText }}>
            Are you sure you want to delete "{eventToDelete?.event_name}"?
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button
              onClick={() => {
                setDeleteOpen(false)
                setEventToDelete(null)
              }}
              disabled={deleting}
              sx={{ color: theme.primaryText }}
            >
              Cancel
            </Button>

            <Button
              onClick={handleDelete}
              disabled={deleting}
              variant="contained"
              color="error"
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </Box>
        </Card>
      </Backdrop>
      <Backdrop
        sx={{ color: theme.primaryText, zIndex: (themes) => themes.zIndex.drawer + 1, overflowY: "auto", p: 2, }}
        open={Boolean(viewEvent)} onClick={() => setViewEvent(null)}
      >
        <Card
          onClick={(e) => e.stopPropagation()}
          sx={{
            width: "100%",
            maxWidth: 550,
            maxHeight: "90dvh",
            overflowY: "auto",
            bgcolor: theme.cardBg,
            color: theme.primaryText,
            border: `1px solid ${theme.cardBorder}`,
            borderRadius: 3,
            p: 3,
          }}
        >
          <Typography variant="h6" sx={{ mb: 3, fontWeight: "bold" }}>
            {viewEvent?.event_name}
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Typography><strong>Type:</strong> {viewEvent?.event_type}</Typography>
            <Typography><strong>College:</strong> {viewEvent?.college_name}</Typography>
            <Typography>
              <strong>Department:</strong> {viewEvent?.department_name || "All Departments"}
            </Typography>
            <Typography><strong>Start Date:</strong> {viewEvent?.start_date}</Typography>
            <Typography><strong>End Date:</strong> {viewEvent?.end_date}</Typography>
            <Typography><strong>Status:</strong> {viewEvent?.event_status}</Typography>
            <Typography>
              <strong>Registration Required:</strong>{" "}
              {viewEvent?.registration_required ? "Yes" : "No"}
            </Typography>
            <Typography>
              <strong>Description:</strong>{" "}
              {viewEvent?.event_description || "No description provided"}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 3 }}>
            <Button
              onClick={() => setViewEvent(null)}
              sx={{ color: theme.primaryText }}
            >
              Close
            </Button>

            <Button
              variant="contained"
              onClick={() => {
                const event = viewEvent
                setViewEvent(null)
                handleEdit(event)
              }}
            >
              Edit Event
            </Button>
          </Box>
        </Card>
      </Backdrop>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          variant="filled"
          severity={error ? "error" : "success"}
          sx={{
            backgroundColor: error
              ? theme.error
              : theme.success,
          }}
        >
          {error || success}
        </Alert>
      </Snackbar>
    </Box>
  )
}
