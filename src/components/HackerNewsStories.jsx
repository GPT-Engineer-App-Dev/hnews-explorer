import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

const fetchStories = async () => {
  const { data } = await axios.get('https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=100');
  return data.hits;
};

const Story = ({ title, points, url, objectID }) => (
  <div className="bg-white p-4 rounded-lg shadow mb-4">
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    <p className="text-gray-600 mb-2">Upvotes: {points}</p>
    <Button asChild>
      <a href={url} target="_blank" rel="noopener noreferrer">Read More</a>
    </Button>
  </div>
);

const HackerNewsStories = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: stories, isLoading, error } = useQuery({
    queryKey: ['hackerNewsStories'],
    queryFn: fetchStories,
  });

  const filteredStories = stories?.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) return <div>Error fetching stories</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Top 100 Hacker News Stories</h1>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search stories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>
      {isLoading ? (
        Array(10).fill().map((_, index) => (
          <div key={index} className="mb-4">
            <Skeleton className="h-24 w-full" />
          </div>
        ))
      ) : (
        filteredStories?.map(story => (
          <Story key={story.objectID} {...story} />
        ))
      )}
    </div>
  );
};

export default HackerNewsStories;