

const FeedbackCard = ({ title, count }) => {
  return (
    <div className="rounded-xl bg-white p-6 text-center shadow">
      <h3 className="text-sm text-gray-500">{title}</h3>
      <p className="mt-2 text-3xl font-bold text-blue-600">{count}</p>
    </div>
  );
};

export default FeedbackCard;
