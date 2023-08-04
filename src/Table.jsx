import React from 'react';

const Table = ({ data }) => {
  return (
      <table className="table table-striped table-responsive">
            <thead>
                    <tr>
                              <th>ID</th>
                                        <th>Name</th>
                                                  <th>Email</th>
                                                          </tr>
                                                                </thead>
                                                                      <tbody>
                                                                              {data.map((item) => (
                                                                                        <tr key={item.id}>
                                                                                                    <td>{item.id}</td>
                                                                                                                <td>{item.name}</td>
                                                                                                                            <td>{item.email}</td>
                                                                                                                                      </tr>
                                                                                                                                              ))}
                                                                                                                                                    </tbody>
                                                                                                                                                        </table>
                                                                                                                                                          );
                                                                                                                                                          };

                                                                                                                                                          export default Table;
                                                                                                                                                          