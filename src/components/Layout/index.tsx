import React from 'react'

interface LayoutProps {
    children: (false | Element)[]
}

const Layout = ({children}:LayoutProps) => {

    console.log(children)
    return (
        <div>
            
        </div>
    )
}

export default Layout
