"use client"; 

import { useState } from "react";
import companiesData from "@/data/companies.json";

export default function CompaniesPage() {
  const [search, setSearch] = useState("");
  const [filterSector, setFilterSector] = useState("All");

  const filteredCompanies = companiesData.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesSector = filterSector === "All" || c.sector === filterSector;
    return matchesSearch && matchesSector;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Discover</h2>
        
        <div className="flex gap-4">
          
          <input 
            type="text" 
            placeholder="Search companies..." 
            className="border p-2 rounded-lg w-64"
            onChange={(e) => setSearch(e.target.value)}
          />
          
      
          <select 
            className="border p-2 rounded-lg"
            onChange={(e) => setFilterSector(e.target.value)}
          >
            <option value="All">All Sectors</option>
            <option value="ClimateTech">ClimateTech</option>
            <option value="Fintech">Fintech</option>
            <option value="AI">AI</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold">Company Name</th>
              <th className="p-4 font-semibold">Sector</th>
              <th className="p-4 font-semibold">Stage</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompanies.map((company) => (
              <tr key={company.id} className="border-b hover:bg-blue-50 transition">
                <td className="p-4 font-medium">{company.name}</td>
                <td className="p-4">{company.sector}</td>
                <td className="p-4">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm">
                    {company.stage}
                  </span>
                </td>
                <td className="p-4 text-blue-600 cursor-pointer hover:underline">
                  <a href={`/companies/${company.id}`}>View Profile →</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}