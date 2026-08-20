// import React from 'react'
import { Box, Grid } from "@mui/material"
import teacher from '../images/card-teacher.jpg'
import student from '../images/card-student.jpg'
import classroom from '../images/card-classroom.jpg'
import { CardUI } from "./CardUI"

export const Admin = () => {
  return (
    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', height: { lg: '80dvh', md: '80dvh' }, width: '100%' }}>
      <Grid container>
        <Grid size={{ lg: 4, md: 4, sm: 6, xs: 12 }} sx={{ p: { lg: 2, md: 1, sm: 2, xs: 2 }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CardUI img={teacher} title="Teacher management" name1="Add Teacher" name2="manage teacher" path1={'/add/teacher'} />
        </Grid>
        <Grid size={{ lg: 4, md: 4, sm: 6, xs: 12 }} sx={{ p: { lg: 2, md: 1, sm: 2, xs: 2 }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CardUI img={student} title="Student management" name1="Add Student" name2="manage student" path1={'/add/student'} />
        </Grid>
        <Grid size={{ lg: 4, md: 4, sm: 12, xs: 12 }} sx={{ p: { lg: 2, md: 1, sm: 2, xs: 2 }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CardUI img={classroom} title="Class management" name1="Add class" name2="manage class" path1={'/add/class'} />
        </Grid>
      </Grid>
    </Box>
  )
}
