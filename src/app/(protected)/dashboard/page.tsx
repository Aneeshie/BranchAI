"use client"
import { useUser } from "@clerk/nextjs"


const DashboardPage = () => {
    const { user } = useUser()

    return (
        <div>{`Current Logged in user: ${user?.fullName}`}</div>
    )
}

export default DashboardPage