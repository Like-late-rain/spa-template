import { parseEther } from 'ethers';
import { useAtomValue } from 'jotai';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { contractAtom } from '@/stores/web3Atoms';
import { showErrorToast, showSuccessToast } from '@/utils/toast';

export default function CreateCourse() {
  const navigate = useNavigate();
  const contract = useAtomValue(contractAtom);
  const [isPending, setIsPending] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    coverUrl: '',
    priceYCT: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 创建课程
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract) return;

    if (!formData.title || !formData.description || !formData.priceYCT) {
      showErrorToast('请填写所有必填字段');
      return;
    }
    setIsPending(true);
    try {
      const priceInWei = parseEther(formData.priceYCT) as bigint;
      const tx = await contract.createCourse(
        formData.title,
        formData.description,
        formData.coverUrl,
        priceInWei
      );
      await tx.wait();
      showSuccessToast('课程创建成功！');
      navigate('/market');
    } catch {
      showErrorToast('创建失败');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">创建课程</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* 课程标题 */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            课程标题 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="输入课程标题"
            required
          />
        </div>

        {/* 课程描述 */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            课程描述 <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="详细描述课程内容"
            required
          />
        </div>

        {/* 封面 URL */}
        <div>
          <label htmlFor="coverUrl" className="block text-sm font-medium text-gray-700 mb-2">
            封面 URL（Cloudflare R2）
          </label>
          <input
            type="url"
            id="coverUrl"
            name="coverUrl"
            value={formData.coverUrl}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="https://your-bucket.r2.dev/image.jpg"
          />
          <p className="text-sm text-gray-500 mt-1">
            请先将图片上传到 Cloudflare R2，然后粘贴公开访问 URL
          </p>
        </div>

        {/* 价格 */}
        <div>
          <label htmlFor="priceYCT" className="block text-sm font-medium text-gray-700 mb-2">
            课程价格（YCT）<span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="priceYCT"
            name="priceYCT"
            value={formData.priceYCT}
            onChange={handleChange}
            step="0.01"
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="100"
            required
          />
        </div>

        {/* 提交按钮 */}
        <button
          type="submit"
          disabled={isPending || !contract}
          className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          {isPending ? '创建中...' : '创建课程'}
        </button>

        {!contract && <p className="text-center text-red-500 text-sm">请先连接钱包</p>}
      </form>
    </div>
  );
}
