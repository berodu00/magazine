import React, { useState, useEffect } from 'react';
import { dashboardService } from '../../services/dashboardService';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { useNavigate } from 'react-router-dom';

const KPICard = ({ title, value, icon, color, subtext }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center hover:shadow-md transition-shadow">
        <div className={`p-4 rounded-full mr-4 ${color} bg-opacity-10 text-2xl`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-wide">{title}</p>
            <h3 className="text-2xl font-black text-gray-900">{value.toLocaleString()}</h3>
            {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
        </div>
    </div>
);

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const DashboardPage = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const data = await dashboardService.getStats();
            setStats(data);
        } catch (err) {
            console.error('Failed to fetch dashboard stats:', err);
            setError('데이터를 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;
    if (!stats) return null;

    // Process Category Data for Pie Chart
    const categoryData = Object.entries(stats.categoryDistribution || {}).map(([name, value]) => ({
        name,
        value
    }));

    return (

        <div className="space-y-8">
            <h1 className="text-3xl font-black text-gray-900">관리자 대시보드</h1>

            {/* KPI Cards (Engagement Focused) */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <KPICard
                    title="총 조회수"
                    value={stats.totalViews || 0}
                    icon="👁️"
                    color="bg-blue-500 text-blue-600"
                    subtext="누적 게시물 조회"
                />
                <KPICard
                    title="임직원 참여"
                    value={stats.participationRate || 0}
                    icon="🔥"
                    color="bg-orange-500 text-orange-600"
                    subtext="반응, 댓글 및 제안 합계"
                />
                <KPICard
                    title="대기 중인 아이디어"
                    value={stats.pendingIdeas || 0}
                    icon="💡"
                    color="bg-yellow-500 text-yellow-600"
                    subtext="검토가 필요한 제안"
                />
                <KPICard
                    title="총 콘텐츠"
                    value={stats.totalArticles + stats.totalSocialContent}
                    icon="📚"
                    color="bg-indigo-500 text-indigo-600"
                    subtext={`사보 ${stats.totalArticles}개 + 소셜 ${stats.totalSocialContent}개`}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Visitor Trend Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                        📈 주간 방문자 추이
                    </h2>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={[...stats.visitorTrend].reverse()}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(date) => date.substring(5)} // MM-DD
                                    axisLine={false}
                                    tickLine={false}
                                    dy={10}
                                    tick={{ fontSize: 12, fill: '#6B7280' }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#6B7280' }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#4F46E5"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: '#4F46E5', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Distribution (Donut Chart) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                        🍰 카테고리 분포
                    </h2>
                    <div className="h-64 w-full flex justify-center items-center">
                        {categoryData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-gray-400 text-sm">데이터가 없습니다.</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Articles Table */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                        🏆 인기 게시물 TOP 5
                    </h2>
                    <div className="space-y-4">
                        {stats.topArticles.map((article, index) => (
                            <div key={article.articleId} className="flex items-start pb-4 border-b border-gray-50 last:border-0 last:pb-0 hover:bg-gray-50 p-2 rounded-lg transition-colors cursor-pointer" onClick={() => navigate(`/magazine/${article.articleId}`)}>
                                <div className={`
                                    flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-3
                                    ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                        index === 1 ? 'bg-gray-100 text-gray-700' :
                                            index === 2 ? 'bg-orange-100 text-orange-700' : 'bg-gray-50 text-gray-500'}
                                `}>
                                    {index + 1}
                                </div>
                                <div className="flex-grow min-w-0">
                                    <p className="font-bold text-gray-900 truncate">{article.title}</p>
                                    <div className="flex items-center text-xs text-gray-500 mt-1">
                                        <span className="font-medium text-blue-600">{article.categoryName}</span>
                                        <span className="mx-1">•</span>
                                        <span>👁️ {article.viewCount.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Ideas Table */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            💡 최신 아이디어 제안
                        </h2>
                        <button onClick={() => navigate('/admin/ideas')} className="text-xs font-bold text-indigo-600 hover:text-indigo-800">
                            전체보기 →
                        </button>
                    </div>
                    <div className="space-y-3">
                        {stats.recentIdeas && stats.recentIdeas.length > 0 ? (
                            stats.recentIdeas.map((idea) => (
                                <div key={idea.ideaId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-indigo-50 transition-colors cursor-pointer" onClick={() => navigate('/admin/ideas')}>
                                    <div className="min-w-0 flex-1 mr-4">
                                        <p className="text-sm font-bold text-gray-900 truncate">{idea.title}</p>
                                        <p className="text-xs text-gray-500">{idea.authorName} • {new Date(idea.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap
                                        ${idea.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                            idea.status === 'REVIEWED' ? 'bg-blue-100 text-blue-700' :
                                                idea.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' :
                                                    'bg-gray-100 text-gray-600'}
                                    `}>
                                        {idea.statusDescription}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 py-8">접수된 아이디어가 없습니다.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
