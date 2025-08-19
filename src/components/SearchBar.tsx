
import { createSignal, For, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";

type SearchBarProps = {
  data: any[];
  placeholder?: string;
};

const SearchBar = (props: SearchBarProps) => {
  const [query, setQuery] = createSignal("");
  const [results, setResults] = createSignal<any[]>([]);
  const navigate = useNavigate();

  const handleSearch = (e: Event) => {
    const value = (e.target as HTMLInputElement).value;
    setQuery(value);
    if (!value.trim()) {
      setResults([]);
      return;
    }
    const filtered = props.data.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(value.toLowerCase()))
    );
    setResults(filtered);
  };

  const handleSelect = (item: any) => {
    navigate(item.path);
    setQuery("");
    setResults([]);
  };

  return (
    <div style={{ position: "relative" }}>
      <input
        type="text"
        value={query()}
        onInput={handleSearch}
        placeholder={props.placeholder || "Cari halaman/fitur..."}
        class="px-4 py-2 border-2 border-green-300 rounded-full w-full shadow focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white text-gray-800"
        autocomplete="off"
  // ...no inline style, use Tailwind/CSS class for shadow...
      />
      <Show when={results().length > 0}>
        <div class="search-dropdown rounded-xl shadow-lg border border-gray-200 mt-2 overflow-hidden animate-fade-in">
          <For each={results()}>{(item) => (
            <div
              class="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-green-100 transition-all border-b border-gray-100 last:border-b-0 group"
              onClick={() => handleSelect(item)}
            >
              {/* Icon or image */}
              {item.icon ? (
                <img src={item.icon} alt="icon" class="w-8 h-8 rounded bg-gray-100 object-contain group-hover:scale-110 transition-transform duration-200" />
              ) : (
                <div class="w-8 h-8 rounded bg-green-100 flex items-center justify-center text-green-600 font-bold text-lg group-hover:bg-green-200 transition-all duration-200">
                  {item.name[0]}
                </div>
              )}
              <div class="flex-1">
                <div class="font-semibold text-gray-800 group-hover:text-green-700 transition-colors duration-200">{item.name}</div>
                <div class="text-xs text-gray-500 mt-1">{item.description}</div>
              </div>
            </div>
          )}</For>
        </div>
      </Show>
    </div>
  );
};

export default SearchBar;
