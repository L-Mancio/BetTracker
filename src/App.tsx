import { useEffect, useState } from "react";
import { DataTable } from "./components/data-table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "./components/ui/tooltip";

type Game = {
  name: string;
  result: [number, number];
  status: "win" | "loss" | "ongoing-win" | "ongoing-loss";
};

const fetchGames = async (): Promise<Game[]> => {
  // axios.get("http://localhost:3000/api/games");
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return [
    {
      name: "Roma -> Juve",
      result: [1, 0],
      status: "ongoing-win",
    },
    {
      name: "Milan -> Inter",
      result: [0, 2],
      status: "ongoing-loss",
    },
    {
      name: "Napoli -> Lazio",
      result: [3, 1],
      status: "win",
    },
    {
      name: "Atalanta -> Fiorentina",
      result: [1, 2],
      status: "loss",
    },
  ];
};

type FetchResult<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

type FetchOptions = {
  refetch?: number;
};

const useFetch = <T,>(
  fn: () => Promise<T>,
  options: FetchOptions = {}
): FetchResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const refetch = options.refetch ?? null;

  useEffect(() => {
    fn()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [fn]);

  useEffect(() => {
    if (refetch) {
      setInterval(() => {
        fn()
          .then(setData)
          .catch(setError)
          .finally(() => setLoading(false));
      }, refetch);
    }
  }, [refetch]);

  return { data, loading, error };
};

const STATUS_COLORS = {
  win: "bg-green-600",
  loss: "bg-red-600",
  "ongoing-win": "bg-green-300",
  "ongoing-loss": "bg-red-300",
};

const GameStatusBadge = ({ status }: { status: Game["status"] }) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <div
          className={`w-4 h-4 rounded-full ml-2 inline-block ${STATUS_COLORS[status]}`}
        />
      </TooltipTrigger>
      <TooltipContent>
        {status === "win"
          ? "Team 1 won"
          : status === "loss"
          ? "Team 2 won"
          : "Game is ongoing"}
      </TooltipContent>
    </Tooltip>
  );
};

function App() {
  const { data, loading } = useFetch(fetchGames);

  return (
    <div className="bg-gray-100 flex justify-center items-center h-screen py-4">
      <div className="p-4 m-4 bg-white border flex-1 flex-col flex h-full rounded-sm">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <DataTable
            data={data ?? []}
            columns={[
              {
                accessorKey: "name",
                header: "Game 1",
              },
              {
                accessorKey: "result",
                header: "Result",
                cell: ({ row }) => {
                  const result = row.original.result;
                  const status = row.original.status;
                  return (
                    <div className="flex items-center">
                      <pre>
                        {result[0]} - {result[1]}
                      </pre>
                      <GameStatusBadge status={status} />
                    </div>
                  );
                },
              },
            ]}
          />
        )}
      </div>
    </div>
  );
}

export default App;
