import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Download, 
  Settings2, 
  Image as ImageIcon, 
  X,
  Check,
  Palette
} from 'lucide-react';
import type { TierItem, TierLevel } from '../models/tier-item';
import { generateSoftColorPairOKLCH } from '../utils/color';
import { JS_GRAMMAR } from '../data/js-grammar';

/**
 * 预设的颜色选项
 */
const PRESET_COLORS = [
  '#FF7F7F', '#FFBF7F', '#FFDF7F', '#FFFF7F', '#BFFF7F', 
  '#7FFF7F', '#7FFFFF', '#7FBFFF', '#7F7FFF', '#FF7FFF'
];

const INITIAL_TIERS: TierLevel[] = [
  { id: 't1', label: '夯', color: '#FF7F7F', items: [] },
  { id: 't2', label: '顶级', color: '#FFBF7F', items: [] },
  { id: 't3', label: '人上人', color: '#FFDF7F', items: [] },
  { id: 't4', label: 'NPC', color: '#BFFF7F', items: [] },
  { id: 't5', label: '拉', color: '#7FFFFF', items: [] },
];

const INITIAL_POOL: TierItem[] = [

];

export default function MainPage() {
  const [tiers, setTiers] = useState<TierLevel[]>(INITIAL_TIERS);
  const [pool, setPool] = useState<TierItem[]>([]);
  const [editingTier, setEditingTier] = useState<TierLevel | null>(null);
  const [inputText, setInputText] = useState<string>('');
  const [draggedItem, setDraggedItem] = useState<TierItem | null>(null);
  const tierContainerRef = useRef(null);

  // 处理图片上传
  const handleImageUpload: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = Array.from(e.target.files!);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const newItem: TierItem = {
          id: `item-${Date.now()}-${Math.random()}`,
          type: 'image',
          imgContent: ev.target!.result as string
        };
        setPool(prev => [...prev, newItem]);
      };
      reader.readAsDataURL(file);
    });
  };

  // 添加文本内容
  const handleAddText = () => {
    if (!inputText.trim()) return;
    const colorPair = generateSoftColorPairOKLCH();
    const newItem: TierItem = {
      id: `item-${Date.now()}-${Math.random()}`,
      type: 'text',
      title: inputText,
      textColor: colorPair.textColor,
      bgColor: colorPair.backgroundColor
    };
    setPool(prev => [...prev, newItem]);
    setInputText('');
  };

  // 拖拽逻辑实现 (原生 HTML5 Drag and Drop)
  const onDragStart = (e: React.DragEvent<HTMLElement>, item: TierItem, sourceId: string) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
    // 设置半透明预览
    setTimeout(() => {
      e.target.classList.add('opacity-40');
    }, 0);
  };

  const onDragEnd = (e: React.DragEvent<HTMLElement>) => {
    e.target.classList.remove('opacity-40');
    setDraggedItem(null);
  };

  const onDrop = (e: React.DragEvent<HTMLElement>, targetTierId: string) => {
    e.preventDefault();
    if (!draggedItem) return;

    // 从来源移除
    if (pool.some(x => x.id == draggedItem.id)) {
      setPool(prev => prev.filter(i => i.id !== draggedItem.id));
    } else {
      setTiers(prev => prev.map(t => ({
        ...t,
        items: t.items.filter(i => i.id !== draggedItem.id)
      })));
    }

    // 添加到目标等级
    if (targetTierId === 'pool') {
      setPool(prev => [...prev, draggedItem]);
    } else {
      setTiers(prev => prev.map(t => {
        if (t.id === targetTierId) {
          return { ...t, items: [...t.items, draggedItem] };
        }
        return t;
      }));
    }
  };

  const onDragOver = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
  };

  // 导出功能
  const exportAsImage = () => {
    // 实际环境中可使用 html2canvas
    window.print(); 
  };

  const renderTierItem = (item: TierItem, sourceId: string) => {
    return (
      <div
        key={item.id}
        draggable
        onDragStart={(e) => onDragStart(e, item, sourceId)}
        onDragEnd={onDragEnd}
        className="flex items-center justify-center overflow-hidden cursor-move hover:scale-105 transition-transform"
      >
        {item.type === 'image' ? (
          <img src={item.imgContent} alt="item" className="w-20 h-20 md:w-24 md:h-24 w-full h-full object-cover" />
        ) : (
          <div className='min-w-40 md:min-w-48 max-w-40 md:max-w-48 h-10 md:h-12 flex items-center justify-center text-center text-md'
            style={{
              color: item.textColor,
              backgroundColor: item.bgColor,
              fontFamily: 'Consolas, sans-serif, monospace, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji',
            }}>
            <span
              className="
                px-2
                leading-snug
                whitespace-normal break-words
                line-clamp-3
              "
            >
              {item.title}
            </span>
          </div>
        )}
      </div>
    )
  }

  useEffect(() => {
    var items: TierItem[] = [];
    JS_GRAMMAR.forEach((value, index) => {
      const colorPair = generateSoftColorPairOKLCH();
      const newItem: TierItem = {
        id: `item-${index}`,
        type: 'text',
        title: value,
        textColor: colorPair.textColor,
        bgColor: colorPair.backgroundColor
      };
      items.push(newItem);
    })
    setPool(items);
  }, []);

  console.log(pool)

  return (
    <div data-theme="dark" className="min-h-screen bg-[#1a1a1a] text-white p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              TierMaker Pro
            </h1>
            <p className="text-gray-400 mt-1">创建属于你的等级排行榜</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={exportAsImage}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-all"
            >
              <Download size={18} /> 导出排行
            </button>
            <button 
              onClick={() => {setTiers(INITIAL_TIERS); setPool([])}}
              className="flex items-center gap-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 px-4 py-2 rounded-lg border border-red-600/30 transition-all"
            >
              <Trash2 size={18} /> 重置
            </button>
          </div>
        </header>

        {/* Tier List Area */}
        <div 
          ref={tierContainerRef}
          className="bg-black rounded-lg border border-gray-800 overflow-hidden mb-8 shadow-2xl"
        >
          {tiers.map((tier) => (
            <div 
              key={tier.id}
              className="flex border-b border-gray-800 min-h-[96px] last:border-b-0"
              onDragOver={onDragOver}
              onDrop={(e) => onDrop(e, tier.id)}
            >
              {/* Tier Label */}
              <div 
                className="w-24 md:w-32 flex-shrink-0 flex items-center justify-center p-2 text-center cursor-pointer relative group"
                style={{ backgroundColor: tier.color }}
                onClick={() => setEditingTier(tier)}
              >
                <span className="text-black font-bold text-lg break-all select-none">
                  {tier.label}
                </span>
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Settings2 size={16} className="text-black" />
                </div>
              </div>

              {/* Tier Content */}
              <div className="flex-grow flex flex-wrap content-start">
                {tier.items.map((item) => (
                  renderTierItem(item, tier.id)
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Controls & Pool Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Content */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Plus size={20} className="text-blue-400" /> 添加内容
              </h2>
              
              <div className="space-y-4">
                {/* Image Upload */}
                <label className="block w-full cursor-pointer group">
                  <div className="border-2 border-dashed border-gray-700 group-hover:border-blue-500 rounded-lg p-4 text-center transition-colors">
                    <ImageIcon className="mx-auto text-gray-500 group-hover:text-blue-400 mb-2" />
                    <span className="text-sm text-gray-400 group-hover:text-gray-300">点击上传图片</span>
                    <input type="file" className="hidden" multiple accept="image/*" onChange={handleImageUpload} />
                  </div>
                </label>

                {/* Text Add */}
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddText()}
                    placeholder="输入文字内容..."
                    className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 flex-grow focus:outline-none focus:border-blue-500 text-sm"
                  />
                  <button 
                    onClick={handleAddText}
                    className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Item Pool */}
          <div className="lg:col-span-2">
            <div 
              className="bg-gray-900 p-6 rounded-xl border border-gray-800 min-h-[200px]"
              onDragOver={onDragOver}
              onDrop={(e) => onDrop(e, 'pool')}
            >
              <h2 className="text-lg font-semibold mb-4 text-gray-400">待分类项目</h2>
              <div className="flex flex-wrap gap-2">
                {pool.length === 0 && (
                  <div className="w-full py-12 text-center text-gray-600 border border-dashed border-gray-800 rounded-lg">
                    暂无内容，请从左侧添加或将项目拖回此处
                  </div>
                )}
                {pool.map((item) => (
                  renderTierItem(item, 'pool')
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Editing Modal */}
        {editingTier && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 w-full max-w-md rounded-2xl p-6 border border-gray-700 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">编辑等级</h3>
                <button onClick={() => setEditingTier(null)} className="text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">等级名称</label>
                  <input 
                    type="text"
                    value={editingTier.label}
                    onChange={(e) => setTiers(prev => prev.map(t => t.id === editingTier.id ? {...t, label: e.target.value} : t))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 text-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                    <Palette size={16} /> 选择颜色
                  </label>
                  <div className="grid grid-cols-5 gap-3">
                    {PRESET_COLORS.map(color => (
                      <button
                        key={color}
                        onClick={() => setTiers(prev => prev.map(t => t.id === editingTier.id ? {...t, color} : t))}
                        className={`w-full aspect-square rounded-lg border-2 transition-transform hover:scale-110 ${editingTier.color === color ? 'border-white' : 'border-transparent'}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => setEditingTier(null)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Check size={20} /> 完成设置
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media print {
          body { background: white !important; color: black !important; }
          .no-print { display: none !important; }
          header, .lg\\:col-span-1, .lg\\:col-span-2 { display: none !important; }
          .max-w-6xl { max-width: 100% !important; margin: 0 !important; }
        }
      `}</style>
    </div>
  );
}