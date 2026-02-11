export default function ChildLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-blue-50/50">
            <main className="container mx-auto p-4 max-w-md h-full min-h-screen flex flex-col">
                {children}
            </main>
        </div>
    )
}
