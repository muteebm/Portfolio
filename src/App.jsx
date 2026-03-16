import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import Portfolio from './pages/Portfolio';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import BlogAdmin from './pages/BlogAdmin';

function App() {
    return (
        <QueryClientProvider client={queryClientInstance}>
            <Router>
                <Routes>
                    <Route path="/" element={<Navigate to="/Portfolio" replace />} />
                    <Route path="/Portfolio" element={<Portfolio />} />
                    <Route path="/Blog" element={<Blog />} />
                    <Route path="/BlogPost/:id" element={<BlogPost />} />
                    <Route path="/BlogAdmin" element={<BlogAdmin />} />
                    <Route path="*" element={<PageNotFound />} />
                </Routes>
            </Router>
            <Toaster />
        </QueryClientProvider>
    )
}

export default App