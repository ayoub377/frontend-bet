// components/MDXContent.tsx
'use client';

import React from 'react';
import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote';

/**
 * A mapping from MDX element names to React components,
 * so you get consistent Tailwind styling across all your posts.
 */
const components: MDXRemoteProps['components'] = {
  h1: (props) => <h1 className="text-4xl font-extrabold mb-4 text-gray-900" {...props} />,
  h2: (props) => <h2 className="text-3xl font-bold mt-8 mb-4 text-gray-800 border-b pb-2" {...props} />,
  h3: (props) => <h3 className="text-2xl font-semibold mt-6 mb-3 text-gray-800" {...props} />,
  p:  (props) => <p className="mb-4 text-gray-700 leading-relaxed" {...props} />,
  ul: (props) => <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700 ml-4" {...props} />,
  ol: (props) => <ol className="list-decimal list-inside mb-4 space-y-1 text-gray-700 ml-4" {...props} />,
  li: (props) => <li className="mb-1" {...props} />,
  a:  (props) => <a className="text-blue-600 hover:underline transition-colors duration-200" {...props} />,
  strong: (props) => <strong className="font-bold text-gray-900" {...props} />,
  em:     (props) => <em className="italic text-gray-700" {...props} />,
  blockquote: (props) => (
    <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 italic text-gray-600 bg-blue-50 rounded-r-md" {...props} />
  ),
  code:  (props) => <code className="bg-gray-100 p-1 rounded text-sm font-mono text-pink-600" {...props} />,
  pre:   (props) => <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto my-4 text-sm leading-relaxed" {...props} />,
  table: (props) => <table className="w-full border-collapse table-auto my-4 text-gray-800" {...props} />,
  thead: (props) => <thead className="bg-gray-100 border-b border-gray-300" {...props} />,
  th:    (props) => <th className="px-4 py-2 text-left font-semibold" {...props} />,
  tbody: (props) => <tbody {...props} />,
  td:    (props) => <td className="px-4 py-2 border-b border-gray-200" {...props} />,
  hr:    (props) => <hr className="my-8 border-t-2 border-gray-200" {...props} />,
  img:   (props) => <img className="max-w-full h-auto rounded-lg shadow-md my-6 mx-auto block" {...props} />,
  // Example of a custom MDX component that uses hooks or state:
  CustomButton: ({ text, onClick }: { text: string; onClick: () => void }) => (
    <button
      onClick={onClick}
      className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 mt-4 inline-block"
    >
      {text}
    </button>
  ),
};

/**
 * Client‐side wrapper around MDXRemote.
 * Pass in the serialized MDX content via props.source,
 * and it will render with our custom components.
 */
export function MDXContent(props: MDXRemoteProps) {
  return <MDXRemote {...props} components={components} />;
}
