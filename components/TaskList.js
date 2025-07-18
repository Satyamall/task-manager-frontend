export default function TaskList({ tasks, updateTask, deleteTask, user }) {
  const statusStyles = {
    Pending: "text-yellow-500 bg-yellow-100",
    "In Progress": "text-blue-500 bg-blue-100",
    Completed: "text-green-500 bg-green-100",
  };
  const defaultStyle = "text-gray-500 bg-gray-100";
  return (
    <>
      <h1 className="text-black text-lg pb-2">Task Manager - Detail Cards</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tasks?.length > 0 &&
          tasks?.map((task) => (
            <div key={task?.id} className="border p-4 rounded shadow">
              <h2 className="text-xl font-bold">{task?.title}</h2>
              <p>{task?.description || "No description"}</p>
              <p>
                Status:{" "}
                <span
                  className={`px-2 py-1 rounded ${
                    statusStyles[task?.status] || defaultStyle
                  }`}
                >
                  {task?.status}
                </span>
              </p>
              {user?.role === "admin" && <p>Created by: {task?.username}</p>}
              {(user?.role === "admin" || task?.user_id === user?.id) && (
                <div className="flex space-x-2 mt-2">
                  <select
                    value={task?.status}
                    onChange={(e) =>
                      updateTask(task.id, { ...task, status: e.target.value })
                    }
                    className="p-2 border rounded"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                  <button
                    onClick={() => deleteTask(task?.id)}
                    className="bg-red-500 text-white p-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
      </div>
    </>
  );
}
