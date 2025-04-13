const CategoryLabel = ({ name }) => {
  return (
    <div className="flex items-center mb-2">
      <h2 className="text-xl font-semibold text-harbor">{name}</h2>
      <div className="ml-3 h-0.5 flex-grow bg-harbor/10 rounded"></div>
    </div>
  );
};

export default CategoryLabel; 