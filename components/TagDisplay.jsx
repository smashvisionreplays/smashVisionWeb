
const TagDisplay = ({ tags }) => {
  const parseTags = (tags) => {
    if (!tags) return [];
    
    // If it's already an array, return it
    if (Array.isArray(tags)) return tags;
    
    // If it's a string that looks like JSON array, parse it
    if (typeof tags === 'string') {
      try {
        const parsed = JSON.parse(tags);
        return Array.isArray(parsed) ? parsed : [tags];
      } catch {
        return [tags];
      }
    }
    
    return [tags];
  };

  const tagArray = parseTags(tags);

  if (tagArray.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1 max-w-xs">
      {tagArray.map((tag, index) => (
        <span
          key={index}
          className="inline-block px-2 py-0.5 text-xs font-medium bg-[#acbb22]/10 text-[#B8E016] border border-[#acbb22]/20 rounded-lg truncate max-w-full"
          title={tag}
        >
          {tag}
        </span>
      ))}
    </div>
  );
};

export default TagDisplay;