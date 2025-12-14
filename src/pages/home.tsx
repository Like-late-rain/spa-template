import {
  ArrowRight,
  Award,
  BookOpen,
  Coins,
  Shield,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <>
      <title>Web3 涂山大学 - 去中心化在线课程平台</title>
      {/* Hero Section */}
      <div className="relative text-center py-24 mb-20">
        {/* 装饰元素 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-cyber-cyan/20 blur-3xl -z-10"></div>

        <div className="mb-8 inline-flex items-center space-x-2 px-4 py-2 glass rounded-full border border-cyber-cyan/30">
          <Sparkles className="text-cyber-cyan" size={16} />
          <span className="text-sm text-gray-300">基于区块链的Web3教育平台</span>
        </div>

        <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
          欢迎来到
          <br />
          <span className="gradient-text animate-glow">Web3 涂山大学</span>
        </h1>

        <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
          探索未来教育新纪元，使用 YCT 代币解锁优质课程，
          <br />
          在去中心化的世界中，掌握 Web3 核心技能
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/market" className="group relative inline-flex items-center justify-center">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-purple rounded-xl blur opacity-60 group-hover:opacity-100 transition"></div>
            <div className="relative px-8 py-4 bg-gradient-to-r from-cyber-cyan to-cyber-blue rounded-xl font-bold text-lg flex items-center space-x-2 hover:scale-105 transition">
              <span>探索课程</span>
              <ArrowRight size={20} />
            </div>
          </Link>

          <Link
            to="/create-course"
            className="group relative inline-flex items-center justify-center"
          >
            <div className="absolute -inset-0.5 bg-white/20 rounded-xl blur"></div>
            <div className="relative px-8 py-4 glass rounded-xl font-bold text-lg border border-cyber-cyan/30 hover:border-cyber-cyan hover:bg-cyber-cyan/10 transition">
              <span>创建课程</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {[
          {
            icon: BookOpen,
            title: '优质课程',
            desc: '精选 Web3 优质课程内容',
            color: 'cyan',
            gradient: 'from-cyber-cyan to-cyan-400',
          },
          {
            icon: Coins,
            title: 'YCT 代币',
            desc: '使用代币购买课程与服务',
            color: 'blue',
            gradient: 'from-cyber-blue to-blue-400',
          },
          {
            icon: TrendingUp,
            title: 'AAVE 理财',
            desc: '存入资产赚取被动收益',
            color: 'purple',
            gradient: 'from-cyber-purple to-purple-400',
          },
          {
            icon: Shield,
            title: '去中心化',
            desc: '完全透明的链上教育平台',
            color: 'green',
            gradient: 'from-cyber-green to-green-400',
          },
        ].map((feature, idx) => (
          <div key={`${feature.title}-${idx}`} className="group relative card-hover">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-white/10 to-white/5 rounded-2xl blur opacity-0 group-hover:opacity-100 transition"></div>
            <div className="relative glass rounded-2xl p-6 border border-white/10 h-full">
              <div
                className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg`}
              >
                <feature.icon className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Core Features Section */}
      <div className="grid md:grid-cols-3 gap-8 mb-20">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyber-cyan to-transparent rounded-2xl blur opacity-25 group-hover:opacity-50 transition"></div>
          <div className="relative glass rounded-2xl p-8 border border-cyber-cyan/30">
            <div className="flex items-center space-x-3 mb-4">
              <Zap className="text-cyber-cyan" size={32} />
              <h3 className="text-2xl font-bold">即时访问</h3>
            </div>
            <p className="text-gray-400 leading-relaxed">
              购买课程后立即解锁内容，无需等待审批，真正的点对点教育交易。
            </p>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyber-blue to-transparent rounded-2xl blur opacity-25 group-hover:opacity-50 transition"></div>
          <div className="relative glass rounded-2xl p-8 border border-cyber-blue/30">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="text-cyber-blue" size={32} />
              <h3 className="text-2xl font-bold">安全可靠</h3>
            </div>
            <p className="text-gray-400 leading-relaxed">
              基于以太坊智能合约，所有交易公开透明，资金安全有保障。
            </p>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyber-purple to-transparent rounded-2xl blur opacity-25 group-hover:opacity-50 transition"></div>
          <div className="relative glass rounded-2xl p-8 border border-cyber-purple/30">
            <div className="flex items-center space-x-3 mb-4">
              <Award className="text-cyber-purple" size={32} />
              <h3 className="text-2xl font-bold">赚取收益</h3>
            </div>
            <p className="text-gray-400 leading-relaxed">
              讲师创建课程获得收益，学员通过 AAVE 理财获取被动收入。
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative mb-20">
        <div className="absolute -inset-1 bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-purple rounded-2xl blur-xl opacity-20"></div>
        <div className="relative glass rounded-2xl p-12 border border-white/10">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="text-5xl font-bold gradient-text mb-3">1,000+</div>
              <div className="text-gray-400 text-lg">活跃用户</div>
            </div>
            <div>
              <div className="text-5xl font-bold gradient-text mb-3">500+</div>
              <div className="text-gray-400 text-lg">优质课程</div>
            </div>
            <div>
              <div className="text-5xl font-bold gradient-text mb-3">100K+</div>
              <div className="text-gray-400 text-lg">YCT 交易量</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative text-center py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-cyber-cyan/10 via-cyber-blue/10 to-cyber-purple/10 rounded-2xl blur-2xl"></div>
        <div className="relative">
          <h2 className="text-4xl font-bold mb-6 gradient-text">准备好开始学习了吗？</h2>
          <p className="text-gray-400 text-xl mb-8 max-w-2xl mx-auto">
            加入我们的社区，开启 Web3 学习之旅
          </p>
          <Link to="/market" className="group relative inline-flex items-center justify-center">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-purple rounded-xl blur opacity-60 group-hover:opacity-100 transition"></div>
            <div className="relative px-10 py-5 bg-gradient-to-r from-cyber-cyan to-cyber-blue rounded-xl font-bold text-xl flex items-center space-x-2 hover:scale-105 transition">
              <span>立即开始</span>
              <ArrowRight size={24} />
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;
