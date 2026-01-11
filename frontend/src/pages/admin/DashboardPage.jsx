import React, { useState, useEffect } from 'react';
import { dashboardService } from '../../services/dashboardService';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar
} from 'recharts';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const KPICard = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
        <div className={`p-4 rounded-full mr-4 ${color} bg-opacity-10 text-2xl`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</h3>
        </div>
    </div>
);

const DashboardPage = () => {
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

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
            <div className="container mx-auto max-w-7xl">
                <h1 className="heading-1 mb-8 text-gray-900">관리자 대시보드</h1>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <KPICard
                        title="총 게시물"
                        value={stats.totalArticles}
                        icon="📝"
                        color="bg-blue-500 text-blue-600"
                    />
                    <KPICard
                        title="진행중인 이벤트"
                        value={stats.totalEvents}
                        icon="🎉"
                        color="bg-purple-500 text-purple-600"
                    />
                    <KPICard
                        title="소셜 콘텐츠"
                        value={stats.totalSocialContent}
                        icon="🌐"
                        color="bg-pink-500 text-pink-600"
                    />
                    <KPICard
                        title="오늘 방문자 (예상)"
                        value={stats.visitorTrend[0]?.count || 0}
                        icon="👥"
                        color="bg-green-500 text-green-600"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Visitor Trend Chart */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="heading-2 mb-6 text-gray-800">주간 방문자 추이</h2>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={[...stats.visitorTrend].reverse()}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={(date) => date.substring(5)} // MM-DD
                                        axisLine={false}
                                        tickLine={false}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
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

                    {/* Top Articles Table */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="heading-2 mb-6 text-gray-800">인기 게시물 TOP 5</h2>
                        <div className="space-y-4">
                            {stats.topArticles.map((article, index) => (
                                <div key={article.articleId} className="flex items-start pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                                    <div className={`
                                        flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-3
                                        ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                            index === 1 ? 'bg-gray-100 text-gray-700' :
                                                index === 2 ? 'bg-orange-100 text-orange-700' : 'bg-gray-50 text-gray-500'}
                                    `}>
                                        {index + 1}
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <p className="font-medium text-gray-900 truncate">{article.title}</p>
                                        <div className="flex items-center text-xs text-gray-500 mt-1">
                                            <span>{article.categoryName}</span>
                                            <span className="mx-1">•</span>
                                            <span>👁️ {article.viewCount.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
