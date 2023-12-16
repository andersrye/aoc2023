input =
  File.read!("./examples/15.txt")
  |> String.split(",")

hash = fn string ->
  String.to_charlist(string)
  |> Enum.reduce(0, fn val, acc -> rem((acc + val) * 17, 256) end)
end

input
|> Enum.map(hash)
|> Enum.sum()
|> then(&IO.puts("solution1 = #{&1}"))

input
|> Enum.map(&Regex.run(~r/(\w+)([=-])(\d?)/, &1))
|> Enum.reduce(%{}, fn [_, label, op, fl], acc ->
  h = hash.(label)
  v = Map.get(acc, h, [])

  Map.put(
    acc,
    h,
    case op do
      "=" ->
        if Enum.any?(v, fn {l, _} -> l == label end) do
          Enum.map(v, fn {l, ofl} ->
            if l == label, do: {l, fl}, else: {l, ofl}
          end)
        else
          v ++ [{label, fl}]
        end

      "-" ->
        Enum.filter(v, fn {l, _} -> l != label end)
    end
  )
end)
|> Enum.reduce(0, fn {h, list}, acc ->
  Enum.with_index(list)
  |> Enum.reduce(0, fn {{_, fl}, index}, acc ->
    acc + (h + 1) * (index + 1) * String.to_integer(fl)
  end)
  |> then(&(acc + &1))
end)
|> then(&IO.puts("solution2 = #{&1}"))
