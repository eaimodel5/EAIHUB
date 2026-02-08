
import React from 'react';
import { Message } from '../types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface MessageBubbleProps {
  message: Message;
  themeClasses?: string; // Optional custom classes for theming
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, themeClasses }) => {
  const isUser = message.role === 'user';
  
  // Clean, matte styles (no borders)
  const userStyle = themeClasses || 'bg-[#1e293b] text-slate-200';
  const modelStyle = 'bg-[#0f172a] text-slate-300';
  const errorStyle = 'bg-red-900/20 text-red-200';

  // Check if repair happened
  const wasRepaired = message.mechanical && message.mechanical.repairAttempts && message.mechanical.repairAttempts > 0;

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[95%] sm:max-w-[85%] rounded-2xl px-5 py-4 text-sm leading-relaxed relative group transition-all duration-300 shadow-sm ${
          message.isError ? errorStyle : (isUser ? userStyle : modelStyle)
        }`}
      >
        <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-white/5 opacity-50">
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest">
                    {isUser ? 'JIJ' : 'EAI'}
                </span>
                
                {/* Repair Badge */}
                {wasRepaired && (
                    <div className="flex items-center gap-1 bg-green-900/30 rounded px-1.5 py-0.5" title="System automatically repaired malformed output">
                        <span className="text-[9px] text-green-400">Fixed</span>
                    </div>
                )}
            </div>
            
            <span className="text-[9px] font-mono">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
        </div>

        <div className="markdown-body">
            {isUser ? (
                 <p className="whitespace-pre-wrap font-sans text-base font-light">{message.text}</p>
            ) : (
                <ReactMarkdown 
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[[rehypeKatex, { strict: false }]]}
                    components={{
                        ul: ({node, ...props}) => <ul className="list-disc list-outside ml-4 mb-2 space-y-1 text-slate-300" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal list-outside ml-4 mb-2 space-y-1 text-slate-300" {...props} />,
                        li: ({node, ...props}) => <li className="" {...props} />,
                        p: ({node, ...props}) => <p className="mb-3 last:mb-0 text-slate-200" {...props} />,
                        strong: ({node, ...props}) => <strong className="font-semibold text-white" {...props} />,
                        h1: ({node, ...props}) => <h1 className="text-lg font-bold text-white mb-2 mt-4" {...props} />,
                        h2: ({node, ...props}) => <h2 className="text-base font-bold text-white mb-2 mt-3" {...props} />,
                        
                        // EAI DATA GRID TABLE STYLING - Matte Look
                        table: ({node, ...props}) => (
                            <div className="overflow-x-auto my-4 rounded-xl bg-black/20">
                                <table className="w-full text-left text-xs sm:text-sm border-collapse" {...props} />
                            </div>
                        ),
                        thead: ({node, ...props}) => <thead className="bg-white/5 text-teal-400 uppercase font-bold tracking-wider" {...props} />,
                        tbody: ({node, ...props}) => <tbody className="divide-y divide-white/5" {...props} />,
                        tr: ({node, ...props}) => <tr className="hover:bg-white/5 transition-colors" {...props} />,
                        th: ({node, ...props}) => <th className="px-4 py-3 font-mono whitespace-nowrap text-[10px] sm:text-xs" {...props} />,
                        td: ({node, ...props}) => <td className="px-4 py-3 align-top border-l border-white/5 first:border-l-0 text-slate-300" {...props} />,

                        // CODE BLOCKS
                        code: ({node, ...props}) => <code className="bg-black/30 text-teal-200 px-1.5 py-0.5 rounded font-mono text-xs mx-0.5" {...props} />,
                        
                        pre: ({node, ...props}) => (
                            <pre className="bg-[#0b1120] rounded-xl p-4 overflow-x-auto my-4 text-xs font-mono text-slate-300" {...props} />
                        ),
                        
                        blockquote: ({node, ...props}) => <blockquote className="border-l-2 border-teal-500/50 pl-4 italic text-slate-400 my-4" {...props} />,
                    }}
                >
                    {message.text}
                </ReactMarkdown>
            )}
        </div>
        
        {/* Debug Info on Hover (Desktop) */}
        {!isUser && message.mechanical && (
            <div className="hidden group-hover:block absolute -bottom-6 right-0 text-[10px] text-slate-500 font-medium">
                {message.mechanical.model} • {message.mechanical.latencyMs}ms
            </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
