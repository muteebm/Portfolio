import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import PageNotFound from './lib/PageNotFound';
import Portfolio from './pages/Portfolio';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import BlogAdmin from './pages/BlogAdmin';

// Wraps route content with an exit/enter transition.
// NOTE: Only animates opacity — transforms/filters on this wrapper break
// position:fixed descendants (custom cursor, navbar, etc.)
function AnimatedRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait" initial={false}>
            <motion.div
                key={location.pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
                <Routes location={location}>
                    <Route path="/" element={<Navigate to="/Portfolio" replace />} />
                    <Route path="/Portfolio" element={<Portfolio />} />
                    <Route path="/Blog" element={<Blog />} />
                    <Route path="/BlogPost/:id" element={<BlogPost />} />
                    <Route path="/BlogAdmin" element={<BlogAdmin />} />
                    <Route path="*" element={<PageNotFound />} />
                </Routes>
            </motion.div>
        </AnimatePresence>
    );
}

function App() {
    return (
        <QueryClientProvider client={queryClientInstance}>
            <Router
                future={{
                    v7_startTransition: true,
                    v7_relativeSplatPath: true,
                }}
            >
                <AnimatedRoutes />
            </Router>
            <Toaster />
        </QueryClientProvider>
    )
}

export default App