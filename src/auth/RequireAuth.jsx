import MainLayout from "../Layout/MainLayout"


const RequireAuth = ({Component}) => {
  return (
   <MainLayout Component={Component} />
  )
}

export default RequireAuth