// import React from 'react'

import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Alert, Backdrop, Box, Button, Card, CardActions, CardContent, Chip, Divider, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Select, Snackbar, TextField, Typography } from "@mui/material"
import { UseTheme } from "../../Controllers/UseTheme"
import { Download, ExpandMore, Search } from "@mui/icons-material"
import { useCallback, useEffect, useState } from "react"
import axios from "axios"
import { FormSessionTrainer } from "./FormSessionTrainer"

export const TrainerEvents = () => {
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
  const [status, setStatus] = useState('')

  const [events, setEvents] = useState([])
  const [sessionsByEvent, setSessionsByEvent] = useState({})
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [selectedSession, setSelectedSession] = useState(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [sessionToDelete, setSessionToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const [openSessionForm, setOpenSessionForm] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)

  const token = localStorage.getItem("token") || sessionStorage.getItem("token")
  const user = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "null")
  const trainerId = user?.id

  const [colleges, setColleges] = useState([])

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

  const fetchTrainerEvents = useCallback(async () => {
    if (!trainerId || !token) {
      setSuccess("")
      setError("Please log in again to view your assigned events.")
      return
    }

    try {
      setLoading(true)

      const [eventsResponse, sessionsResponse, collegesResponse] =
        await Promise.all([
          axios.get(`http://localhost:5000/api/events/`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }),
          axios.get(`http://localhost:5000/api/events/sessions/my?trainer_id=${trainerId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }),
          axios.get(`http://localhost:5000/api/college/`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
        ])

      const allEvents = Array.isArray(eventsResponse.data)
        ? eventsResponse.data
        : eventsResponse.data.events || []

      const assignedSessions = Array.isArray(sessionsResponse.data)
        ? sessionsResponse.data
        : sessionsResponse.data.sessions || []

      const collegeList = Array.isArray(collegesResponse.data)
        ? collegesResponse.data
        : collegesResponse.data.colleges || []

      const assignedEventIds = new Set(
        assignedSessions.map(session => Number(session.event_id))
      )

      const trainerEvents = allEvents.filter(event =>
        Number(event.trainer_id) === Number(trainerId) ||
        assignedEventIds.has(Number(event.id))
      )

      const groupedSessions = {}

      assignedSessions.forEach(session => {
        const eventId = session.event_id

        if (!groupedSessions[eventId]) {
          groupedSessions[eventId] = []
        }

        groupedSessions[eventId].push(session)
      })

      setEvents(trainerEvents)
      setSessionsByEvent(groupedSessions)
      setColleges(collegeList)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load assigned events.")
      setSuccess("")
      setOpenSnackbar(true)
    } finally {
      setLoading(false)
    }
  }, [trainerId, token])

  useEffect(() => {
    fetchTrainerEvents()
  }, [fetchTrainerEvents])

  const handleDeleteSession = (session) => {
    setSessionToDelete(session)
    setDeleteOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!sessionToDelete) return

    try {
      setDeleting(true)

      await axios.delete(
        `http://localhost:5000/api/events/sessions/delete/${sessionToDelete.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setSuccess("Session deleted successfully.")
      setError("")
      setOpenSnackbar(true)
      setDeleteOpen(false)
      setSessionToDelete(null)

      await fetchTrainerEvents()
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete session.")
      setSuccess("")
      setOpenSnackbar(true)
    } finally {
      setDeleting(false)
    }
  }

  const handleDownloadReport = (event) => {
    setError(
      `PDF generation for "${event.event_name}" needs the report API.`
    )
  }

  const handleAddSession = (event) => {
    setSelectedEvent(event)
    setSelectedSession(null)
    setOpenSessionForm(true)
  }

  const handleEditSession = (event, session) => {
    setSelectedEvent(event)
    setSelectedSession(session)
    setOpenSessionForm(true)
  }

  const handleCloseSessionForm = () => {
    setOpenSessionForm(false)
    setSelectedEvent(null)
    setSelectedSession(null)
  }

  const handleSessionUpdated = async () => {
    await fetchTrainerEvents()
  }

  const filteredEvents = events.filter(event => {

    const matchesSearch =
      !search ||
      event.event_name?.toLowerCase().includes(search.toLowerCase()) ||
      event.college_name?.toLowerCase().includes(search.toLowerCase()) ||
      event.department_name?.toLowerCase().includes(search.toLowerCase())

    const matchesType =
      !eventType || event.event_type === eventType

    const matchesCollege =
      !college || String(event.college_id) === college

    const matchesStatus =
      !status || event.event_status === status

    return (
      matchesSearch &&
      matchesType &&
      matchesCollege &&
      matchesStatus
    )
  })

  const totalSessions = Object.values(sessionsByEvent)
    .reduce((total, sessions) => total + sessions.length, 0)

  const completedEvents = events.filter(
    event => event.event_status === "Completed"
  ).length

  const formatDate = value => {
    if (!value) return "Not scheduled"

    return new Date(value).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    })
  }

  const formatTime = value => {
    if (!value) return "--"

    return String(value).slice(0, 5)
  }
  return (
    <Box sx={{ flexGrow: 1, minHeight: '100dvh', height: 'auto', overflowY: 'auto', }}>
      <Grid container>
        <Grid size={12}>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container>
              <Grid size={12}>
                <Box
                  sx={{
                    display: 'flex', alignItems: { lg: 'flex-start', md: 'flex-start', sm: 'center', xs: 'center' }, flexDirection: 'column', p: 2
                  }}>
                  <Typography variant="h5" sx={{ color: theme.primaryText, fontWeight: 'bold' }}>
                    Events
                  </Typography>
                  <Typography sx={{ color: theme.secondaryText }}>
                    Manage your assigned events and sessions
                  </Typography>
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
                    <Grid size={{ lg: 4, md: 4, sm: 12, xs: 12 }}>
                      <Box sx={{ pt: 2, pl: 2, pr: { lg: 0, md: 0, sm: 2, xs: 2 } }}>
                        <Card sx={{ bgcolor: theme.cardBg, borderColor: theme.cardBorder }}>
                          <Box
                            sx={{
                              display: 'flex', alignItems: { lg: 'flex-start', md: 'flex-start', sm: 'center', xs: 'center' },
                              justifyContent: 'center', flexDirection: 'column', p: 2
                            }}>
                            <Typography sx={{ color: theme.secondaryText }}>
                              Assigned Events
                            </Typography>
                            <Typography variant="h3" sx={{ color: theme.primaryText, fontWeight: 'bold' }}>
                              {events.length}
                            </Typography>
                          </Box>
                        </Card>
                      </Box>
                    </Grid>
                    <Grid size={{ lg: 4, md: 4, sm: 12, xs: 12 }}>
                      <Box sx={{ pt: 2, pl: 2, pr: { lg: 0, md: 0, sm: 2, xs: 2 } }}>
                        <Card sx={{ bgcolor: theme.cardBg, borderColor: theme.cardBorder }}>
                          <Box
                            sx={{
                              display: 'flex', alignItems: { lg: 'flex-start', md: 'flex-start', sm: 'center', xs: 'center' },
                              justifyContent: 'center', flexDirection: 'column', p: 2
                            }}>
                            <Typography sx={{ color: theme.secondaryText }}>
                              My Sessions
                            </Typography>
                            <Typography variant="h3" sx={{ color: theme.primaryText, fontWeight: 'bold' }}>
                              {totalSessions}
                            </Typography>
                          </Box>
                        </Card>
                      </Box>
                    </Grid>
                    <Grid size={{ lg: 4, md: 4, sm: 12, xs: 12 }}>
                      <Box sx={{ pt: 2, pl: 2, pr: 2 }}>
                        <Card sx={{ bgcolor: theme.cardBg, borderColor: theme.cardBorder }}>
                          <Box
                            sx={{
                              display: 'flex', alignItems: { lg: 'flex-start', md: 'flex-start', sm: 'center', xs: 'center' },
                              justifyContent: 'center', flexDirection: 'column', p: 2
                            }}>
                            <Typography sx={{ color: theme.secondaryText }}>
                              Completed Events
                            </Typography>
                            <Typography variant="h3" sx={{ color: theme.primaryText, fontWeight: 'bold' }}>
                              {completedEvents}
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
                  <TextField variant="outlined" fullWidth placeholder="Search" value={search}
                    onChange={(e) => setSearch(e.target.value)}
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
          {loading ? (
            <Box sx={{ p: 3 }}>
              <Typography sx={{ color: theme.secondaryText }}>
                Loading your assigned events...
              </Typography>
            </Box>
          ) : filteredEvents.length === 0 ? (
            <Box sx={{ p: 3 }}>
              <Typography sx={{ color: theme.secondaryText }}>
                No assigned events or sessions found.
              </Typography>
            </Box>
          ) : (
            filteredEvents.map(event => {
              const eventSessions = sessionsByEvent[event.id] || []

              return (
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
                        {event.event_type}
                      </Typography>
                      <Typography sx={{ color: theme.primaryText }}>
                        {event.college_name || "College not available"}
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
                      <Accordion sx={{ width: '100%', bgcolor: theme.cardBg }}>
                        <AccordionSummary
                          expandIcon={<ExpandMore sx={{ color: theme.primaryText }} />}
                        >
                          <Box sx={{ flexGrow: 1 }}>
                            <Grid container>
                              <Grid size={12}>
                                <Box>
                                  <Typography variant="h6" sx={{ color: theme.primaryText, fontWeight: 'bold' }}>
                                    My sessions ({eventSessions.length})
                                  </Typography>
                                  <Typography sx={{ color: theme.secondaryText }}>
                                    View schedule, edit or delete sessions
                                  </Typography>
                                </Box>
                              </Grid>
                            </Grid>
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                          {eventSessions.map((session, index) => (
                            <Box sx={{ p: 1 }} key={session.id}>
                              <Card
                                variant="outlined"
                                sx={{ bgcolor: theme.cardBg, borderColor: theme.cardBorder }}
                              >
                                <CardContent>
                                  <Typography sx={{ color: theme.primaryText, fontWeight: "bold", fontSize: 18 }}>
                                    {index + 1}. {session.session_title}
                                  </Typography>
                                  <Typography sx={{ color: theme.primaryText }}>
                                    {formatDate(session.session_date)}
                                  </Typography>
                                  <Typography sx={{ color: theme.primaryText }}>
                                    {formatTime(session.start_time)} to {formatTime(session.end_time)}
                                  </Typography>
                                  <Typography sx={{ color: theme.primaryText }}>
                                    {session.session_details || "No description"}
                                  </Typography>
                                </CardContent>
                                <CardActions>
                                  <Button sx={{ color: theme.secondaryText }}
                                    onClick={() => handleEditSession(event, session)}>Edit</Button>
                                  <Button sx={{ color: theme.error }}
                                    onClick={() => handleDeleteSession(session)}>Delete</Button>
                                </CardActions>
                              </Card>
                            </Box>
                          ))}
                        </AccordionDetails>
                        <AccordionActions>
                          <Box sx={{ flexGrow: 1 }}>
                            <Grid container>
                              <Grid size={12}>
                                <Box sx={{ mb: 2, px: 2 }}>
                                  <Button fullWidth sx={{
                                    color: theme.secondaryText,
                                    borderColor: theme.secondaryText,
                                    borderRadius: 5
                                  }} variant="outlined"
                                    onClick={() => handleAddSession(event)}>+ Add Section</Button>
                                </Box>
                              </Grid>
                              <Grid size={12}>
                                <Box sx={{ mb: 2, px: 2 }}>
                                  <Button fullWidth sx={{
                                    color: theme.secondaryText,
                                    borderColor: theme.secondaryText,
                                    borderRadius: 5
                                  }} onClick={() => handleDownloadReport(event)}><Download /> Download Report</Button>
                                </Box>
                              </Grid>
                            </Grid>
                          </Box>
                        </AccordionActions>
                      </Accordion>
                    </CardActions>
                  </Card>
                </Box>
              )
            })
          )}
        </Grid>
      </Grid>
      <Backdrop
        open={openSessionForm}
        onClick={handleCloseSessionForm}
        sx={{ color: theme.primaryText, zIndex: (themes) => themes.zIndex.drawer + 1, overflowY: "auto", p: 2, }}
      >
        {openSessionForm && selectedEvent && (
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{
              width: "100%",
              maxWidth: 750,
              my: "auto",
            }}
          >
            <FormSessionTrainer
              key={`${selectedEvent.id}-${selectedSession?.id || "new"}`}
              event={selectedEvent}
              session={selectedSession}
              trainer={user}
              onClose={handleCloseSessionForm}
              onUpdated={handleSessionUpdated}
            />
          </Box>
        )}
      </Backdrop>
      <Backdrop
        sx={{
          color: theme.primaryText,
          zIndex: (theme) => theme.zIndex.drawer + 2,
          p: 2,
        }}
        open={deleteOpen}
        onClick={() => {
          if (!deleting) {
            setDeleteOpen(false)
            setSessionToDelete(null)
          }
        }}
      >
        <Card
          onClick={(e) => e.stopPropagation()}
          sx={{
            p: 3,
            width: "100%",
            minWidth: 280,
            maxWidth: 420,
            bgcolor: theme.cardBg,
            color: theme.primaryText,
            border: `1px solid ${theme.cardBorder}`,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Delete Session
          </Typography>

          <Typography sx={{ mb: 3, color: theme.secondaryText }}>
            Are you sure you want to delete "{sessionToDelete?.session_title}"?
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button
              onClick={() => {
                setDeleteOpen(false)
                setSessionToDelete(null)
              }}
              disabled={deleting}
              sx={{ color: theme.primaryText }}
            >
              Cancel
            </Button>

            <Button
              onClick={handleConfirmDelete}
              disabled={deleting}
              variant="contained"
              color="error"
            >
              {deleting ? "Deleting..." : "Delete"}
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
