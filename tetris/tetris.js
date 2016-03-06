(function($) {
	$.Tetris = {};
		// The keycode enum.
		var KeyCode = {
			Left: 37,
			Up: 38,
			Right: 39,
			Down: 40
		};
		var Shape = {
			FourByOne: 0, // (I)
			ThreeByTwo: 1, // (Z)
			TwoByTwo: 2, // (field)
			TwoByThree: 3, // (Z y-reflection)
			TwoByThree1: 4, // (L)
			TwoByThree2: 5, // (L y-reflection)
			TwoByThree3: 6, // (T)
			Total: 7
		};
		var NumberConst = {
			Zero: 0,
			One: 1,
			Two: 2,
			Three: 3,
			Four: 4
		};
		var State = {
			NineClock: 0,
			TwelveClock: 1,
			ThreeClock: 2,
			SixClock: 3,
			Total: 4
		}

		var BaseShape = base2.Base.extend({
			Initialize: function (parent, state) {
				throw 'Should touch here in BaseShape.Initialize';
			},
			Destroy: function () {
				throw 'Should touch here in BaseShape.Destroy';
			},
			Transform: function (targetState) {
				throw 'Should touch here in BaseShape.Transform';
			},
			GetColumns: function () {
				throw 'Should touch here in BaseShape.GetColumns';
			},
			GetRows: function () {
				throw 'Should touch here in BaseShape.GetRows';
			},
			GetBoxCountInRow: function (rowIndex) {
				throw 'Should touch here in BaseShape.GetBoxCountInRow';
			},
			GetBoxCountInColumn: function (columnIndex) {
				throw 'Should touch here in BaseShape.GetBoxCountInColumn';
			},
			GetRow: function (rowIndex) {
				throw 'Should touch here in BaseShape.GetRow';
			},
			GetColumn: function (columnIndex) {
				throw 'Should touch here in BaseShape.GetColumn';
			},
			GetStartBoxInRow: function (rowIndex) {
				throw 'Should touch here in BaseShape.GetStartBoxInRow';
			},
			GetEndBoxInRow: function (rowIndex) {
				throw 'Should touch here in BaseShape.GetEndBoxInRow';
			},
			GetStartBoxInColumn: function (columnIndex) {
				throw 'Should touch here in BaseShape.GetStartBoxInColumn';
			},
			GetEndBoxInColumn: function (columnIndex) {
				throw 'Should touch here in BaseShape.GetEndBoxInColumn';
			},
			CalculateWidthInPixel: function () {
				return (this.GetRows() * (boxWidth + gap) - 1);
			},
			CalculateHeightInPixel: function () {
				return (this.GetColumns() * (boxHeight + gap) - 1);
			},
			MakeBox: function (left, top, rowIndex, columnIndex) {
				return $('<div></div>').addClass('box-base')
									   .addClass(this.MakeXPositionClass(rowIndex))
									   .addClass(this.MakeYPositionClass(columnIndex))
									   .css({ 'left': left + 'px',
										   'top': top + 'px'
									   });
			},
			MakeBlock: function (width, height) {
				return $('<div id="block"></div>').addClass('move-base').css({
					'width': width + 'px',
					'height': height + 'px'
				});
			},
			MakeXPositionClass: function (x) {
				return ('positionx_' + x);
			},
			MakeYPositionClass: function (y) {
				return ('positiony_' + y);
			},
			MakeXPositionClassSelector: function (x) {
				return ('.positionx_' + x);
			},
			MakeYPositionClassSelector: function (y) {
				return ('.positiony_' + y);
			}
		});

		var FourByOneShape = BaseShape.extend({
			constructor: function () {
				this.state = State.TwelveClock;
				this.width = this.CalculateWidthInPixel();
				this.height = this.CalculateHeightInPixel();
				var block = this.MakeBlock(this.width, this.height);
				this.items = new Array();
				this.items.push(this.MakeBox(NumberConst.Zero, NumberConst.Zero, NumberConst.Zero, NumberConst.Zero));
				this.items.push(this.MakeBox(NumberConst.Zero, boxWidth + gap, NumberConst.One, NumberConst.Zero));
				this.items.push(this.MakeBox(NumberConst.Zero, (NumberConst.Two) * (boxWidth + gap), NumberConst.Two, NumberConst.Zero));
				this.items.push(this.MakeBox(NumberConst.Zero, (NumberConst.Three) * (boxWidth + gap), NumberConst.Three, NumberConst.Zero));
				$.each(this.items, function (indexInArray, valueOfElement) {
					$(valueOfElement).appendTo(block);
				});
				this.block = block;
			},
			Initialize: function (parent, state) {
				this.rowIndex = 0;
				this.columnIndex = 7;
				this.block.css({ 'top': '1px',
					'left': '148px'
				});
				this.Transform(state);
				this.block.appendTo(parent);
			},
			Destroy: function () {
				this.block.remove();
			},
			Transform: function (targetState) {
				if (this.state == targetState) {
					return;
				}

				if (targetState == State.NineClock || targetState == State.ThreeClock) {
					this.items[NumberConst.Zero].css({ 'left': (NumberConst.Three * (boxWidth + gap)) + 'px',
						'top': (NumberConst.Zero) + 'px'
					});
					this.items[NumberConst.One].css({ 'left': (NumberConst.Two * (boxWidth + gap)) + 'px',
						'top': (NumberConst.Zero) + 'px'
					});
					this.items[NumberConst.Two].css({ 'left': (boxWidth + gap) + 'px',
						'top': (NumberConst.Zero) + 'px'
					});
					this.items[NumberConst.Three].css({ 'left': (NumberConst.Zero) + 'px',
						'top': (NumberConst.Zero) + 'px'
					});
				} else if (targetState == State.TwelveClock || targetState == State.SixClock) {
					this.items[NumberConst.Zero].css({ 'left': (NumberConst.Zero) + 'px',
						'top': (NumberConst.Zero) + 'px'
					});
					this.items[NumberConst.One].css({ 'left': (NumberConst.Zero) + 'px',
						'top': (boxWidth + gap) + 'px'
					});
					this.items[NumberConst.Two].css({ 'left': (NumberConst.Zero) + 'px',
						'top': (NumberConst.Two * (boxWidth + gap)) + 'px'
					});
					this.items[NumberConst.Three].css({ 'left': (NumberConst.Zero) + 'px',
						'top': (NumberConst.Three * (boxWidth + gap)) + 'px'
					});
				} else {
					throw ('Invalid value for targetState:' + targetState);
				}
				this.state = targetState;
				this.width = this.CalculateWidthInPixel();
				this.height = this.CalculateHeightInPixel();
			},
			GetColumns: function () {
				if ((this.state == State.TwelveClock) || (this.state == State.SixClock)) {
					return this._GetColumns();
				} else if ((this.state == State.NineClock) || (this.state == State.ThreeClock)) {
					return this._GetRows();
				}
			},
			GetRows: function () {
				if ((this.state == State.TwelveClock) || (this.state == State.SixClock)) {
					return this._GetRows();
				} else if ((this.state == State.NineClock) || (this.state == State.ThreeClock)) {
					return this._GetColumns();
				}
			},
			GetBoxCountInRow: function (rowIndex) {
				return this.GetRow(rowIndex).length;
			},
			GetBoxCountInColumn: function (columnIndex) {
				return this.GetColumn(columnIndex).length;
			},
			GetRow: function (rowIndex) {
				if ((this.state == State.TwelveClock) || (this.state == State.SixClock)) {
					return this._GetRow(rowIndex);
				} else if ((this.state == State.NineClock) || (this.state == State.ThreeClock)) {
					return this._GetColumn(rowIndex).toArray().reverse();
				}
			},
			GetColumn: function (columnIndex) {
				var modCount;
				if ((this.state == State.TwelveClock) || (this.state == State.SixClock)) {
					return this._GetColumn(columnIndex);
				} else if ((this.state == State.NineClock) || (this.state == State.ThreeClock)) {
					modCount = this._GetRows() - 1;
					return this._GetRow(modCount - columnIndex).toArray().reverse();
				}
			},
			GetStartBoxInRow: function (rowIndex) {
				return this.GetRow(rowIndex)[NumberConst.Zero];
			},
			GetEndBoxInRow: function (rowIndex) {
				return this.GetRow(rowIndex)[this.GetBoxCountInRow(rowIndex) - NumberConst.One];
			},
			GetStartBoxInColumn: function (columnIndex) {
				return this.GetColumn(columnIndex)[NumberConst.Zero];
			},
			GetEndBoxInColumn: function (columnIndex) {
				return this.GetColumn(columnIndex)[this.GetBoxCountInColumn(columnIndex) - NumberConst.One];
			},
			_GetColumns: function () {
				return NumberConst.One;
			},
			_GetRows: function () {
				return NumberConst.Four;
			},
			_GetRow: function (rowIndex) {
				if (rowIndex < NumberConst.Zero || rowIndex >= this._GetRows()) {
					throw ('rowIndex: ' + rowIndex + 'is invalid in method GetRow');
				}
				return this.block.children(this.MakeXPositionClassSelector(rowIndex));
			},
			_GetColumn: function (columnIndex) {
				if (columnIndex < NumberConst.Zero || columnIndex >= this._GetColumns()) {
					throw ('columnIndex: ' + columnIndex + 'is invalid in method GetColumn');
				}
				return this.block.children(this.MakeYPositionClassSelector(columnIndex));
			}
		});

		var ThreeByTwoShape = BaseShape.extend({
			constructor: function() {
				this.state = State.TwelveClock;
				this.width = this.CalculateWidthInPixel();
				this.height = this.CalculateHeightInPixel();
				var block = this.MakeBlock(this.width, this.height);
				this.items = new Array();
				this.items.push(this.MakeBox(boxWidth + gap, NumberConst.Zero, NumberConst.Zero, NumberConst.One));
				this.items.push(this.MakeBox(NumberConst.Zero, boxWidth + gap, NumberConst.One, NumberConst.Zero));
				this.items.push(this.MakeBox(boxWidth + gap, boxWidth + gap, NumberConst.One, NumberConst.One));
				this.items.push(this.MakeBox(NumberConst.Zero, NumberConst.Two * (boxWidth + gap), NumberConst.Two, NumberConst.Zero));
				$.each(this.items, function (indexInArray, valueOfElement) {
					$(valueOfElement).appendTo(block);
				});
				this.block = block;
			},
			Initialize: function (parent, state) {
				this.rowIndex = 0;
				this.columnIndex = 7;
				this.block.css({ 'top': '1px',
					'left': '148px'
				});
				this.Transform(state);
				this.block.appendTo(parent);					
			},
			Destroy: function () {
				this.block.remove();					
			},
			Transform: function (targetState) {
				if (this.state == targetState) {
					return;
				}

				if (targetState == State.TwelveClock || targetState == State.SixClock) {
					this.items[NumberConst.Zero].css({'left': (boxWidth + gap) + 'px',
													  'top': (NumberConst.Zero) + 'px',
					});
					this.items[NumberConst.One].css({'left': (NumberConst.Zero) + 'px',
													 'top': (boxWidth + gap) + 'px'
					});
					this.items[NumberConst.Two].css({'left': (boxWidth + gap) + 'px',
													 'top': (boxWidth + gap) + 'px'
					});
					this.items[NumberConst.Three].css({'left': (NumberConst.Zero) + 'px',
													 'top': (NumberConst.Two * (boxWidth + gap)) + 'px'
					});
				} else if (targetState == State.ThreeClock || targetState == State.NineClock) {
					this.items[NumberConst.Zero].css({'left': (NumberConst.Two * (boxWidth + gap)) + 'px',
													  'top': (boxWidth + gap) + 'px',
					});
					this.items[NumberConst.One].css({'left': (boxWidth + gap) + 'px',
													 'top': (NumberConst.Zero) + 'px'
					});
					this.items[NumberConst.Two].css({'left': (boxWidth + gap) + 'px',
													 'top': (boxWidth + gap) + 'px'
					});
					this.items[NumberConst.Three].css({'left': (NumberConst.Zero) + 'px',
													 'top': (NumberConst.Zero) + 'px'
					});
				} else {
					throw ('Invalid value for targetState:' + this.state);
				}
				this.state = targetState;
				this.width = this.CalculateWidthInPixel();
				this.height = this.CalculateHeightInPixel();					
			},
			GetColumns: function () {
				if (this.state == State.TwelveClock || this.state == State.SixClock) {
					return this._GetColumns();
				} else if (this.state == State.NineClock || this.state == State.ThreeClock) {
					return this._GetRows();
				}
			},
			GetRows: function () {
				if (this.state == State.TwelveClock || this.state == State.SixClock) {
					return this._GetRows();
				} else if (this.state == State.NineClock || this.state == State.ThreeClock) {
					return this._GetColumns();
				}					
			},
			GetBoxCountInRow: function (rowIndex) {
				return this.GetRow(rowIndex).length;
			},
			GetBoxCountInColumn: function (columnIndex) {
				return this.GetColumn(columnIndex).length;
			},
			GetRow: function (rowIndex) {
				if (this.state == State.TwelveClock || this.state == State.SixClock) {
					return this._GetRow(rowIndex);
				} else if (this.state == State.NineClock || this.state == State.ThreeClock) {
					return this._GetColumn(rowIndex).toArray().reverse();
				}
			},
			GetColumn: function (columnIndex) {
				if (this.state == State.TwelveClock || this.state == State.SixClock) {
					return this._GetColumn(columnIndex);
				} else if (this.state == State.NineClock || this.state == State.ThreeClock) {
					var modCount = this._GetRows() - 1;
					return this._GetRow(modCount - columnIndex);
				}
			},
			GetStartBoxInRow: function (rowIndex) {
				return this.GetRow(rowIndex)[NumberConst.Zero];
			},
			GetEndBoxInRow: function (rowIndex) {
				return this.GetRow(rowIndex)[this.GetBoxCountInRow(rowIndex) - NumberConst.One];
			},
			GetStartBoxInColumn: function (columnIndex) {
					return this.GetColumn(columnIndex)[NumberConst.Zero];
			},
			GetEndBoxInColumn: function (columnIndex) {
					return this.GetColumn(columnIndex)[this.GetBoxCountInColumn(columnIndex) - NumberConst.One];
			},
			_GetColumns: function () {
				return NumberConst.Two;
			},
			_GetRows: function () {
				return NumberConst.Three;
			},
			_GetRow: function (rowIndex) {
				if (rowIndex < NumberConst.Zero || rowIndex >= this._GetRows()) {
					throw ('Invalid parameter rowIndex: ' + rowIndex + ' in method GetRowInternal');
				}
				return this.block.children(this.MakeXPositionClassSelector(rowIndex));
			},
			_GetColumn: function (columnIndex) {
				if (columnIndex < NumberConst.Zero || columnIndex >= this._GetColumns()) {
					throw ('Invalid parameter columnIndex:' + columnIndex + ' in method GetColumnInternal');
				}
				return this.block.children(this.MakeYPositionClassSelector(columnIndex));
			}
		});

		var TwoByTwoShape = BaseShape.extend({
			constructor: function (parent, state) {
				this.state = State.TwelveClock;
				this.width = this.CalculateWidthInPixel();
				this.height = this.CalculateHeightInPixel();
				var block = this.MakeBlock(this.width, this.height);
				this.items = new Array();
				this.items.push(this.MakeBox(NumberConst.Zero, NumberConst.Zero, NumberConst.Zero, NumberConst.Zero));
				this.items.push(this.MakeBox(boxWidth + gap, NumberConst.Zero, NumberConst.Zero, NumberConst.One));
				this.items.push(this.MakeBox(NumberConst.Zero, boxWidth + gap, NumberConst.One, NumberConst.Zero));
				this.items.push(this.MakeBox(boxWidth + gap, boxWidth + gap, NumberConst.One, NumberConst.One));
				$.each(this.items, function (indexInArray, valueOfElement) {
					$(valueOfElement).appendTo(block);
				});
				this.block = block;	                
			},
			Initialize: function(parent, state) {
				this.rowIndex = 0;
				this.columnIndex = 7;
				this.block.css({ 'top': '1px',
					'left': '148px'
				});
				this.Transform(state);
				this.block.appendTo(parent);		
			},
			Destroy: function () {
				this.block.remove();		                
			},
			Transform: function (targetState) {
				// Nothing to do here.
			},
			GetColumns: function () {
				return NumberConst.Two;
			},
			GetRows: function () {
				return NumberConst.Two;
			},
			GetBoxCountInRow: function (rowIndex) {
				if (rowIndex < NumberConst.Zero || rowIndex >= this.GetRows()) {
					throw ('Invalid parameter rowIndex:' + rowIndex + ' in method GetBoxCountInRow');
				}
				return NumberConst.Two;
			},
			GetBoxCountInColumn: function (columnIndex) {
				if (columnIndex < NumberConst.Zero || columnIndex >= this.GetColumns()) {
					throw ('Invalid parameter columnIndex:' + columnIndex + ' in method GetBoxCountInColumn');
				}
				return NumberConst.Two;
			},
			GetRow: function (rowIndex) {
				if (rowIndex < NumberConst.Zero || rowIndex >= this.GetRows()) {
					throw ('Invalid parameter rowIndex:' + rowIndex + ' in method GetRow');
				}
				return this.block.children(this.MakeXPositionClassSelector(rowIndex));
			},
			GetColumn: function (columnIndex) {
				if (columnIndex < NumberConst.Zero || columnIndex >= this.GetColumns()) {
					throw ('Invalid parameter columnIndex:' + columnIndex + ' in method GetColumn');
				}
				return this.block.children(this.MakeYPositionClassSelector(columnIndex));
			},
			GetStartBoxInRow: function (rowIndex) {
				return this.GetRow(rowIndex)[NumberConst.Zero];
			},
			GetEndBoxInRow: function (rowIndex) {
				return this.GetRow(rowIndex)[this.GetBoxCountInRow(rowIndex) - 1]
			},
			GetStartBoxInColumn: function (columnIndex) {
				return this.GetColumn(columnIndex)[NumberConst.Zero];
			},
			GetEndBoxInColumn: function (columnIndex) {
				return this.GetColumn(columnIndex)[this.GetBoxCountInColumn(columnIndex) - 1];
			}
		});

		var TwoByThreeShape = BaseShape.extend({
			constructor: function() {
				this.state = State.TwelveClock;
				this.width = this.CalculateWidthInPixel();
				this.height = this.CalculateHeightInPixel();
				var block = this.MakeBlock(this.width, this.height);
				this.items = new Array();
				this.items.push(this.MakeBox(NumberConst.Zero, NumberConst.Zero, NumberConst.Zero, NumberConst.Zero));
				this.items.push(this.MakeBox(NumberConst.Zero, boxWidth + gap, NumberConst.One, NumberConst.Zero));
				this.items.push(this.MakeBox(boxWidth + gap, boxWidth + gap, NumberConst.One, NumberConst.One));
				this.items.push(this.MakeBox(boxWidth + gap, NumberConst.Two * (boxWidth + gap), NumberConst.Two, NumberConst.One));
				$.each(this.items, function (indexInArray, valueOfElement) {
					$(valueOfElement).appendTo(block);
				});
				this.block = block;
			},
			Initialize: function (parent, state) {
				this.rowIndex = 0;
				this.columnIndex = 7;
				this.block.css({ 'top': '1px',
					'left': '148px'
				});
				this.Transform(state);
				this.block.appendTo(parent);					
			},
			Destroy: function () {
				this.block.remove();					
			},
			Transform: function (targetState) {
				if (this.state == targetState) {
					return;
				}

				if (targetState == State.TwelveClock || targetState == State.SixClock) {
					this.items[NumberConst.Zero].css({'left': (NumberConst.Zero) + 'px',
													  'top': (NumberConst.Zero) + 'px',
					});
					this.items[NumberConst.One].css({'left': (NumberConst.Zero) + 'px',
													 'top': (boxWidth + gap) + 'px'
					});
					this.items[NumberConst.Two].css({'left': (boxWidth + gap) + 'px',
													 'top': (boxWidth + gap) + 'px'
					});
					this.items[NumberConst.Three].css({'left': (boxWidth + gap) + 'px',
													 'top': (NumberConst.Two * (boxWidth + gap)) + 'px'
					});
				} else if (targetState == State.ThreeClock || targetState == State.NineClock) {
					this.items[NumberConst.Zero].css({'left': (NumberConst.Two * (boxWidth + gap)) + 'px',
													  'top': (NumberConst.Zero) + 'px',
					});
					this.items[NumberConst.One].css({'left': (boxWidth + gap) + 'px',
													 'top': (NumberConst.Zero) + 'px'
					});
					this.items[NumberConst.Two].css({'left': (boxWidth + gap) + 'px',
													 'top': (boxWidth + gap) + 'px'
					});
					this.items[NumberConst.Three].css({'left': (NumberConst.Zero) + 'px',
													 'top': (boxWidth + gap) + 'px'
					});
				} else {
					throw ('Invalid value for targetState:' + this.state);
				}
				this.state = targetState;
				this.width = this.CalculateWidthInPixel();
				this.height = this.CalculateHeightInPixel();					
			},
			GetColumns: function () {
				if (this.state == State.TwelveClock || this.state == State.SixClock) {
					return this._GetColumns();
				} else if (this.state == State.NineClock || this.state == State.ThreeClock) {
					return this._GetRows();
				}
			},
			GetRows: function () {
				if (this.state == State.TwelveClock || this.state == State.SixClock) {
					return this._GetRows();
				} else if (this.state == State.NineClock || this.state == State.ThreeClock) {
					return this._GetColumns();
				}					
			},
			GetBoxCountInRow: function (rowIndex) {
				return this.GetRow(rowIndex).length;
			},
			GetBoxCountInColumn: function (columnIndex) {
				return this.GetColumn(columnIndex).length;
			},
			GetRow: function (rowIndex) {
				if (this.state == State.TwelveClock || this.state == State.SixClock) {
					return this._GetRow(rowIndex);
				} else if (this.state == State.NineClock || this.state == State.ThreeClock) {
					return this._GetColumn(rowIndex).toArray().reverse();
				}
			},
			GetColumn: function (columnIndex) {
				if (this.state == State.TwelveClock || this.state == State.SixClock) {
					return this._GetColumn(columnIndex);
				} else if (this.state == State.NineClock || this.state == State.ThreeClock) {
					var modCount = this._GetRows() - 1;
					return this._GetRow(modCount - columnIndex);
				}
			},
			GetStartBoxInRow: function (rowIndex) {
				return this.GetRow(rowIndex)[NumberConst.Zero];
			},
			GetEndBoxInRow: function (rowIndex) {
				return this.GetRow(rowIndex)[this.GetBoxCountInRow(rowIndex) - 1];
			},
			GetStartBoxInColumn: function (columnIndex) {
				return this.GetColumn(columnIndex)[NumberConst.Zero];
			},
			GetEndBoxInColumn: function (columnIndex) {
				return this.GetColumn(columnIndex)[this.GetBoxCountInColumn(columnIndex) - 1];
			},
			_GetColumns: function () {
				return NumberConst.Two;
			},
			_GetRows: function () {
				return NumberConst.Three;
			},
			_GetRow: function (rowIndex) {
				if (rowIndex < NumberConst.Zero || rowIndex >= this._GetRows()) {
					throw ('Invalid parameter rowIndex: ' + rowIndex + ' in method _GetRow');
				}
				return this.block.children(this.MakeXPositionClassSelector(rowIndex));
			},
			_GetColumn: function (columnIndex) {
				if (columnIndex < NumberConst.Zero || columnIndex >= this._GetColumns()) {
					throw ('Invalid parameter columnIndex:' + columnIndex + ' in method _GetColumn');
				}
				return this.block.children(this.MakeYPositionClassSelector(columnIndex));
			}
		});

		var TwoByThreeShape1 = BaseShape.extend({
			constructor: function() {
				this.state = State.TwelveClock;
				this.width = this.CalculateWidthInPixel();
				this.height = this.CalculateHeightInPixel();
				var block = this.MakeBlock(this.width, this.height);
				this.items = new Array();
				this.items.push(this.MakeBox(NumberConst.Zero, NumberConst.Zero, NumberConst.Zero, NumberConst.Zero));
				this.items.push(this.MakeBox(NumberConst.Zero, boxWidth + gap, NumberConst.One, NumberConst.Zero));
				this.items.push(this.MakeBox(NumberConst.Zero, NumberConst.Two * (boxWidth + gap), NumberConst.Two, NumberConst.Zero));
				this.items.push(this.MakeBox(boxWidth + gap, NumberConst.Two * (boxWidth + gap), NumberConst.Two, NumberConst.One));
				$.each(this.items, function (indexInArray, valueOfElement) {
					$(valueOfElement).appendTo(block);
				});
				this.block = block;
			},
			Initialize: function (parent, state) {
				this.rowIndex = 0;
				this.columnIndex = 7;
				this.block.css({ 'top': '1px',
					'left': '148px'
				});
				this.Transform(state);
				this.block.appendTo(parent);					
			},
			Destroy: function () {
				this.block.remove();					
			},
			Transform: function (targetState) {
				if (this.state == targetState) {
					return;
				}

				if (targetState == State.TwelveClock) {
					this.items[NumberConst.Zero].css({'left': (NumberConst.Zero) + 'px',
													  'top': (NumberConst.Zero) + 'px',
					});
					this.items[NumberConst.One].css({'left': (NumberConst.Zero) + 'px',
													 'top': (boxWidth + gap) + 'px'
					});
					this.items[NumberConst.Two].css({'left': (NumberConst.Zero) + 'px',
													 'top': (NumberConst.Two * (boxWidth + gap)) + 'px'
					});
					this.items[NumberConst.Three].css({'left': (boxWidth + gap) + 'px',
													 'top': (NumberConst.Two * (boxWidth + gap)) + 'px'
					});
				} else if (targetState == State.ThreeClock) {
					this.items[NumberConst.Zero].css({'left': (NumberConst.Two * (boxWidth + gap)) + 'px',
													  'top': (NumberConst.Zero) + 'px',
					});
					this.items[NumberConst.One].css({'left': (boxWidth + gap) + 'px',
													 'top': (NumberConst.Zero) + 'px'
					});
					this.items[NumberConst.Two].css({'left': (NumberConst.Zero) + 'px',
													 'top': (NumberConst.Zero) + 'px'
					});
					this.items[NumberConst.Three].css({'left': (NumberConst.Zero) + 'px',
													 'top': (boxWidth + gap) + 'px'
					});
				} else if (targetState == State.SixClock) {
					this.items[NumberConst.Zero].css({'left': (boxWidth + gap) + 'px',
													  'top': (NumberConst.Two * (boxWidth + gap)) + 'px',
					});
					this.items[NumberConst.One].css({'left': (boxWidth + gap) + 'px',
													 'top': (boxWidth + gap) + 'px'
					});
					this.items[NumberConst.Two].css({'left': (boxWidth + gap) + 'px',
													 'top': (NumberConst.Zero) + 'px'
					});
					this.items[NumberConst.Three].css({'left': (NumberConst.Zero) + 'px',
													 'top': (NumberConst.Zero) + 'px'
					});
				} else if (targetState == State.NineClock) {
					this.items[NumberConst.Zero].css({'left': (NumberConst.Zero) + 'px',
													  'top': (boxWidth + gap) + 'px',
					});
					this.items[NumberConst.One].css({'left': (boxWidth + gap) + 'px',
													 'top': (boxWidth + gap) + 'px'
					});
					this.items[NumberConst.Two].css({'left': (NumberConst.Two * (boxWidth + gap)) + 'px',
													 'top': (boxWidth + gap) + 'px'
					});
					this.items[NumberConst.Three].css({'left': (NumberConst.Two * (boxWidth + gap)) + 'px',
													 'top': (NumberConst.Zero) + 'px'
					});
				} else {
					throw ('Invalid value for targetState:' + this.state);
				}
				this.state = targetState;
				this.width = this.CalculateWidthInPixel();
				this.height = this.CalculateHeightInPixel();					
			},
			GetColumns: function () {
				if (this.state == State.TwelveClock || this.state == State.SixClock) {
					return this._GetColumns();
				} else if (this.state == State.NineClock || this.state == State.ThreeClock) {
					return this._GetRows();
				}
			},
			GetRows: function () {
				if (this.state == State.TwelveClock || this.state == State.SixClock) {
					return this._GetRows();
				} else if (this.state == State.NineClock || this.state == State.ThreeClock) {
					return this._GetColumns();
				}					
			},
			GetBoxCountInRow: function (rowIndex) {
				return this.GetRow(rowIndex).length;
			},
			GetBoxCountInColumn: function (columnIndex) {
				return this.GetColumn(columnIndex).length;
			},
			GetRow: function (rowIndex) {
				var modCount;
				if (this.state == State.TwelveClock) {
					return this._GetRow(rowIndex);
				} else if (this.state == State.ThreeClock) {
					return this._GetColumn(rowIndex).toArray().reverse();
				} else if (this.state == State.SixClock) {
					modCount = this._GetRows() - 1;
					return this._GetRow(modCount - rowIndex).toArray().reverse();
				} else if (this.state == State.NineClock) {
					modCount = this._GetColumns() - 1;
					return this._GetColumn(modCount - rowIndex);
				}
			},
			GetColumn: function (columnIndex) {
				var modCount;
				if (this.state == State.TwelveClock) {
					return this._GetColumn(columnIndex);
				} else if (this.state == State.ThreeClock) {
					modCount = this._GetRows() - 1;
					return this._GetRow(modCount - columnIndex);
				} else if (this.state == State.SixClock) {
					modCount = this._GetColumns() - 1;
					return this._GetColumn(modCount - columnIndex).toArray().reverse();
				} else if (this.state == State.NineClock) {
					return this._GetRow(columnIndex).toArray().reverse();
				}
			},
			GetStartBoxInRow: function (rowIndex) {
				return this.GetRow(rowIndex)[NumberConst.Zero];
			},
			GetEndBoxInRow: function (rowIndex) {
				return this.GetRow(rowIndex)[this.GetBoxCountInRow(rowIndex) - 1];
			},
			GetStartBoxInColumn: function (columnIndex) {
				return this.GetColumn(columnIndex)[NumberConst.Zero];
			},
			GetEndBoxInColumn: function (columnIndex) {
				return this.GetColumn(columnIndex)[this.GetBoxCountInColumn(columnIndex) - 1];
			},
			_GetColumns: function () {
				return NumberConst.Two;
			},
			_GetRows: function () {
				return NumberConst.Three;
			},
			_GetBoxCountInRow: function (rowIndex) {
				if (rowIndex < NumberConst.Zero || rowIndex >= this._GetRows()) {
					throw ('Invalid parameter rowIndex: ' + rowIndex + ' in method _GetBoxCountInRow');
				}
				return this.block.children(this.MakeXPositionClassSelector(rowIndex)).length;
			},
			_GetBoxCountInColumn: function (columnIndex) {
				if (columnIndex < NumberConst.Zero || columnIndex >= this._GetColumns()) {
					throw ('Invalid parameter columnIndex:' + columnIndex + ' in method _GetBoxCountInColumn');
				}
				return this.block.children(this.MakeYPositionClassSelector(columnIndex)).length;
			},
			_GetRow: function (rowIndex) {
				if (rowIndex < NumberConst.Zero || rowIndex >= this._GetRows()) {
					throw ('Invalid parameter rowIndex: ' + rowIndex + ' in method _GetRow');
				}
				return this.block.children(this.MakeXPositionClassSelector(rowIndex));
			},
			_GetColumn: function (columnIndex) {
				if (columnIndex < NumberConst.Zero || columnIndex >= this._GetColumns()) {
					throw ('Invalid parameter columnIndex:' + columnIndex + ' in method _GetColumn');
				}
				return this.block.children(this.MakeYPositionClassSelector(columnIndex));
			}
		});

		var TwoByThreeShape2 = BaseShape.extend({
			constructor: function() {
				this.state = State.TwelveClock;
				this.width = this.CalculateWidthInPixel();
				this.height = this.CalculateHeightInPixel();
				var block = this.MakeBlock(this.width, this.height);
				this.items = new Array();
				this.items.push(this.MakeBox(boxWidth + gap, NumberConst.Zero, NumberConst.Zero, NumberConst.One));
				this.items.push(this.MakeBox(boxWidth + gap, boxWidth + gap, NumberConst.One, NumberConst.One));
				this.items.push(this.MakeBox(NumberConst.Zero, NumberConst.Two * (boxWidth + gap), NumberConst.Two, NumberConst.Zero));
				this.items.push(this.MakeBox(boxWidth + gap, NumberConst.Two * (boxWidth + gap), NumberConst.Two, NumberConst.One));
				$.each(this.items, function (indexInArray, valueOfElement) {
					$(valueOfElement).appendTo(block);
				});
				this.block = block;
			},
			Initialize: function (parent, state) {
				this.rowIndex = 0;
				this.columnIndex = 7;
				this.block.css({ 'top': '1px',
					'left': '148px'
				});
				this.Transform(state);
				this.block.appendTo(parent);					
			},
			Destroy: function () {
				this.block.remove();					
			},
			Transform: function (targetState) {
				if (this.state == targetState) {
					return;
				}

				if (targetState == State.TwelveClock) {
					this.items[NumberConst.Zero].css({'left': (boxWidth + gap) + 'px',
													  'top': (NumberConst.Zero) + 'px',
					});
					this.items[NumberConst.One].css({'left': (boxWidth + gap) + 'px',
													 'top': (boxWidth + gap) + 'px'
					});
					this.items[NumberConst.Two].css({'left': (NumberConst.Zero) + 'px',
													 'top': (NumberConst.Two * (boxWidth + gap)) + 'px'
					});
					this.items[NumberConst.Three].css({'left': (boxWidth + gap) + 'px',
													 'top': (NumberConst.Two * (boxWidth + gap)) + 'px'
					});
				} else if (targetState == State.ThreeClock) {
					this.items[NumberConst.Zero].css({'left': (NumberConst.Two * (boxWidth + gap)) + 'px',
													  'top': (boxWidth + gap) + 'px',
					});
					this.items[NumberConst.One].css({'left': (boxWidth + gap) + 'px',
													 'top': (boxWidth + gap) + 'px'
					});
					this.items[NumberConst.Two].css({'left': (NumberConst.Zero) + 'px',
													 'top': (NumberConst.Zero) + 'px'
					});
					this.items[NumberConst.Three].css({'left': (NumberConst.Zero) + 'px',
													 'top': (boxWidth + gap) + 'px'
					});
				} else if (targetState == State.SixClock) {
					this.items[NumberConst.Zero].css({'left': (NumberConst.Zero) + 'px',
													  'top': (NumberConst.Two * (boxWidth + gap)) + 'px',
					});
					this.items[NumberConst.One].css({'left': (NumberConst.Zero) + 'px',
													 'top': (boxWidth + gap) + 'px'
					});
					this.items[NumberConst.Two].css({'left': (boxWidth + gap) + 'px',
													 'top': (NumberConst.Zero) + 'px'
					});
					this.items[NumberConst.Three].css({'left': (NumberConst.Zero) + 'px',
													 'top': (NumberConst.Zero) + 'px'
					});
				} else if (targetState == State.NineClock) {
					this.items[NumberConst.Zero].css({'left': (NumberConst.Zero) + 'px',
													  'top': (NumberConst.Zero) + 'px',
					});
					this.items[NumberConst.One].css({'left': (boxWidth + gap) + 'px',
													 'top': (NumberConst.Zero) + 'px'
					});
					this.items[NumberConst.Two].css({'left': (NumberConst.Two * (boxWidth + gap)) + 'px',
													 'top': (boxWidth + gap) + 'px'
					});
					this.items[NumberConst.Three].css({'left': (NumberConst.Two * (boxWidth + gap)) + 'px',
													 'top': (NumberConst.Zero) + 'px'
					});
				} else {
					throw ('Invalid value for targetState:' + this.state);
				}
				this.state = targetState;
				this.width = this.CalculateWidthInPixel();
				this.height = this.CalculateHeightInPixel();				
			},
			GetColumns: function () {
				if (this.state == State.TwelveClock || this.state == State.SixClock) {
					return this._GetColumns();
				} else if (this.state == State.NineClock || this.state == State.ThreeClock) {
					return this._GetRows();
				}
			},
			GetRows: function () {
				if (this.state == State.TwelveClock || this.state == State.SixClock) {
					return this._GetRows();
				} else if (this.state == State.NineClock || this.state == State.ThreeClock) {
					return this._GetColumns();
				}					
			},
			GetBoxCountInRow: function (rowIndex) {
				return this.GetRow(rowIndex).length;
			},
			GetBoxCountInColumn: function (columnIndex) {
				return this.GetColumn(columnIndex).length;
			},
			GetRow: function (rowIndex) {
				var modCount;
				if (this.state == State.TwelveClock) {
					return this._GetRow(rowIndex);
				} else if (this.state == State.ThreeClock) {
					return this._GetColumn(rowIndex).toArray().reverse();
				} else if (this.state == State.SixClock) {
					modCount = this._GetRows() - 1;
					return this._GetRow(modCount - rowIndex).toArray().reverse();
				} else if (this.state == State.NineClock) {
					modCount = this._GetColumns() - 1;
					return this._GetColumn(modCount - rowIndex);
				}
			},
			GetColumn: function (columnIndex) {
				var modCount;
				if (this.state == State.TwelveClock) {
					return this._GetColumn(columnIndex);
				} else if (this.state == State.ThreeClock) {
					modCount = this._GetRows() - 1;
					return this._GetRow(modCount - columnIndex).toArray().reverse();
				} else if (this.state == State.SixClock) {
					modCount = this._GetColumns() - 1;
					return this._GetColumn(modCount - columnIndex).toArray().reverse();
				} else if (this.state == State.NineClock) {
					return this._GetRow(columnIndex).toArray().reverse();
				}
			},
			GetStartBoxInRow: function (rowIndex) {
				return this.GetRow(rowIndex)[NumberConst.Zero];
			},
			GetEndBoxInRow: function (rowIndex) {
				return this.GetRow(rowIndex)[this.GetBoxCountInRow(rowIndex) - 1];
			},
			GetStartBoxInColumn: function (columnIndex) {
				return this.GetColumn(columnIndex)[NumberConst.Zero];
			},
			GetEndBoxInColumn: function (columnIndex) {
				return this.GetColumn(columnIndex)[this.GetBoxCountInColumn(columnIndex) - 1];
			},
			_GetColumns: function () {
				return NumberConst.Two;
			},
			_GetRows: function () {
				return NumberConst.Three;
			},
			_GetRow: function (rowIndex) {
				if (rowIndex < NumberConst.Zero || rowIndex >= this._GetRows()) {
					throw ('Invalid parameter rowIndex: ' + rowIndex + ' in method GetRowInternal');
				}
				return this.block.children(this.MakeXPositionClassSelector(rowIndex));
			},
			_GetColumn: function (columnIndex) {
				if (columnIndex < NumberConst.Zero || columnIndex >= this._GetColumns()) {
					throw ('Invalid parameter columnIndex:' + columnIndex + ' in method GetColumnInternal');
				}
				return this.block.children(this.MakeYPositionClassSelector(columnIndex));
			}
		});

		var TwoByThreeShape3 = BaseShape.extend({
			constructor: function() {
				this.state = State.TwelveClock;
				this.width = this.CalculateWidthInPixel();
				this.height = this.CalculateHeightInPixel();
				var block = this.MakeBlock(this.width, this.height);
				this.items = new Array();
				this.items.push(this.MakeBox(NumberConst.Zero, NumberConst.Zero, NumberConst.Zero, NumberConst.Zero));
				this.items.push(this.MakeBox(boxWidth + gap, NumberConst.Zero, NumberConst.Zero, NumberConst.One));
				this.items.push(this.MakeBox(NumberConst.Two*(boxWidth + gap), NumberConst.Zero, NumberConst.Zero, NumberConst.Two));
				this.items.push(this.MakeBox(boxWidth + gap, boxWidth + gap, NumberConst.One, NumberConst.One));
				$.each(this.items, function (indexInArray, valueOfElement) {
					$(valueOfElement).appendTo(block);
				});
				this.block = block;
			},
			Initialize: function (parent, state) {
				this.rowIndex = 0;
				this.columnIndex = 7;
				this.block.css({ 'top': '1px',
					'left': '148px'
				});
				this.Transform(state);
				this.block.appendTo(parent);					
			},
			Destroy: function () {
				this.block.remove();					
			},
			Transform: function (targetState) {
				if (this.state == targetState) {
					return;
				}

				if (targetState == State.TwelveClock) {
					this.items[NumberConst.Zero].css({'left': (NumberConst.Zero) + 'px',
													  'top': (NumberConst.Zero) + 'px',
					});
					this.items[NumberConst.One].css({'left': (boxWidth + gap) + 'px',
													 'top': (NumberConst.Zero) + 'px'
					});
					this.items[NumberConst.Two].css({'left': (NumberConst.Two * (boxWidth + gap)) + 'px',
													 'top': (NumberConst.Zero) + 'px'
					});
					this.items[NumberConst.Three].css({'left': (boxWidth + gap) + 'px',
													 'top': (boxWidth + gap) + 'px'
					});
				} else if (targetState == State.ThreeClock) {
					this.items[NumberConst.Zero].css({'left': (boxWidth + gap) + 'px',
													  'top': (NumberConst.Zero) + 'px',
					});
					this.items[NumberConst.One].css({'left': (boxWidth + gap) + 'px',
													 'top': (boxWidth + gap) + 'px'
					});
					this.items[NumberConst.Two].css({'left': (boxWidth + gap) + 'px',
													 'top': (NumberConst.Two * (boxWidth + gap)) + 'px'
					});
					this.items[NumberConst.Three].css({'left': (NumberConst.Zero) + 'px',
													 'top': (boxWidth + gap) + 'px'
					});
				} else if (targetState == State.SixClock) {
					this.items[NumberConst.Zero].css({'left': (NumberConst.Two * (boxWidth + gap)) + 'px',
													  'top': (boxWidth + gap) + 'px',
					});
					this.items[NumberConst.One].css({'left': (boxWidth + gap) + 'px',
													 'top': (boxWidth + gap) + 'px'
					});
					this.items[NumberConst.Two].css({'left': (NumberConst.Zero) + 'px',
													 'top': (boxWidth + gap) + 'px'
					});
					this.items[NumberConst.Three].css({'left': (boxWidth + gap) + 'px',
													 'top': (NumberConst.Zero) + 'px'
					});
				} else if (targetState == State.NineClock) {
					this.items[NumberConst.Zero].css({'left': (NumberConst.Zero) + 'px',
													  'top': (NumberConst.Two * (boxWidth + gap)) + 'px',
					});
					this.items[NumberConst.One].css({'left': (NumberConst.Zero) + 'px',
													 'top': (boxWidth + gap) + 'px'
					});
					this.items[NumberConst.Two].css({'left': (NumberConst.Zero) + 'px',
													 'top': (NumberConst.Zero) + 'px'
					});
					this.items[NumberConst.Three].css({'left': (boxWidth + gap) + 'px',
													 'top': (boxWidth + gap) + 'px'
					});
				} else {
					throw ('Invalid value for targetState:' + this.state);
				}
				this.state = targetState;
				this.width = this.CalculateWidthInPixel();
				this.height = this.CalculateHeightInPixel();				
			},
			GetColumns: function () {
				if (this.state == State.TwelveClock || this.state == State.SixClock) {
					return this._GetColumns();
				} else if (this.state == State.NineClock || this.state == State.ThreeClock) {
					return this._GetRows();
				}
			},
			GetRows: function () {
				if (this.state == State.TwelveClock || this.state == State.SixClock) {
					return this._GetRows();
				} else if (this.state == State.NineClock || this.state == State.ThreeClock) {
					return this._GetColumns();
				}					
			},
			GetBoxCountInRow: function (rowIndex) {
				return this.GetRow(rowIndex).length;
			},
			GetBoxCountInColumn: function (columnIndex) {
				return this.GetColumn(columnIndex).length;
			},
			GetRow: function (rowIndex) {
				var modCount;
				if (this.state == State.TwelveClock) {
					return this._GetRow(rowIndex);
				} else if (this.state == State.ThreeClock) {
					return this._GetColumn(rowIndex).toArray().reverse();
				} else if (this.state == State.SixClock) {
					modCount = this._GetRows() - 1;
					return this._GetRow(modCount - rowIndex).toArray().reverse();
				} else if (this.state == State.NineClock) {
					modCount = this._GetColumns() - 1;
					return this._GetColumn(modCount - rowIndex);
				}
			},
			GetColumn: function (columnIndex) {
				var modCount;
				if (this.state == State.TwelveClock) {
					return this._GetColumn(columnIndex);
				} else if (this.state == State.ThreeClock) {
					modCount = this._GetRows() - 1;
					return this._GetRow(modCount - columnIndex);
				} else if (this.state == State.SixClock) {
					modCount = this._GetColumns() - 1;
					return this._GetColumn(modCount - columnIndex).toArray().reverse();
				} else if (this.state == State.NineClock) {
					return this._GetRow(columnIndex).toArray().reverse();
				}
			},
			GetStartBoxInRow: function (rowIndex) {
				return this.GetRow(rowIndex)[NumberConst.Zero];
			},
			GetEndBoxInRow: function (rowIndex) {
				return this.GetRow(rowIndex)[this.GetBoxCountInRow(rowIndex) - 1];
			},
			GetStartBoxInColumn: function (columnIndex) {
				return this.GetColumn(columnIndex)[NumberConst.Zero];
			},
			GetEndBoxInColumn: function (columnIndex) {
				return this.GetColumn(columnIndex)[this.GetBoxCountInColumn(columnIndex) - 1];
			},
			_GetColumns: function () {
				return NumberConst.Three;
			},
			_GetRows: function () {
				return NumberConst.Two;
			},
			_GetRow: function (rowIndex) {
				if (rowIndex < NumberConst.Zero || rowIndex >= this._GetRows()) {
					throw ('Invalid parameter rowIndex: ' + rowIndex + ' in method GetRowInternal');
				}
				return this.block.children(this.MakeXPositionClassSelector(rowIndex));
			},
			_GetColumn: function (columnIndex) {
				if (columnIndex < NumberConst.Zero || columnIndex >= this._GetColumns()) {
					throw ('Invalid parameter columnIndex:' + columnIndex + ' in method GetColumnInternal');
				}
				return this.block.children(this.MakeYPositionClassSelector(columnIndex));
			}
		});

		var EmptySegments = base2.Base.extend({
			constructor: function () {
				this.items = new Array();
			},
			Push: function (emptySegment) {
				this.items.push(emptySegment);
			},
			Pop: function () {
				return this.items.pop();
			},
			Top: function() {
				if (this.items.length <= 0) {
					throw ('The EmptySegments object is empty!');
				}
				return this.items[this.items.length - 1];
			},
			Length: function() {
				return this.items.length;
			},
			Contains: function (rowIndex) {
				var result = false;
				for (var i = this.items.length - 1; i >= 0; i--) {
					if ((this.items[i].startIndex <= rowIndex) &&
						(this.items[i].endIndex >= rowIndex)) {
						result = true;
						break;
					}
				}
				return result;
			},
			MergeConjunctive: function (conjunctionSegment) {
				var result = false;
				for (var i = this.items.length - 1; i >= 1; i--) {
					if ((this.items[i].endIndex == (conjunctionSegment.startIndex + 1)) &&
						(this.items[i - 1].startIndex == (conjunctionSegment.endIndex + 1))) {
						this.items[i - 1].startIndex = this.items[i].startIndex;
						this.items.splice(i, 1);
						result = true;
						break;
					} else if (this.items[i].startIndex == (conjunctionSegment.endIndex + 1)) {
						this.items[i].startIndex = conjunctionSegment.startIndex;
						result = true;
						break;
					} else if ((this.items[i].endIndex + 1) == conjunctionSegment.startIndex) {
						this.items[i].endIndex = conjunctionSegment.endIndex;
						result = true;
						break;
					}
				}
				return result;
			},
			Divide: function(rowIndex) {
				var result = false;
				for (var i = this.items.length - 1; i >= 0; i--) {
					if ((this.items[i].startIndex < rowIndex) && 
						(this.items[i].endIndex > rowIndex)) {
						this.items.splice(i, 1, new EmptySegment(this.items[i].startIndex, rowIndex - 1), 
							new EmptySegment(rowIndex + 1, this.items[i].endIndex));
						result = true;
						break;
					} else if ((this.items[i].startIndex == rowIndex) && 
							   (this.items[i].endIndex == rowIndex)) {
						this.items.splice(i, 1);
						result = true;
						break;
					} else if (this.items[i].startIndex == rowIndex) {
						this.items[i].startIndex += 1;
						result = true;
						break;
					} else if (this.items[i].endIndex == rowIndex) {
						this.items[i].endIndex -= 1;
						result = true;
						break;
					} else {
						// nothing to do
					}
				}
				return result;
			}
		});

		// The max columns of the RussiaBox.
		var cols = 16;
		// The max rows of the RussiaBox.
		var rows = 20;
		// The width in pixel of every smallest box which makes up bigger component.
		var boxWidth = 20;
		// The height in pixel of every smallest box which makes up bigger component.
		var boxHeight = boxWidth;
		// The count of boxes in a component.
		var unitInComponent = 4;
		var gap = 1;
		// Records the top of every column.
		var tops;
		// Records the empty segments under the top in a seperate column.
		var segments;
		
		var fourByOneShape = new FourByOneShape();
		var threeByTwoShape = new ThreeByTwoShape();
		var twoByTwoShape = new TwoByTwoShape();
		var twoByThreeShape = new TwoByThreeShape();
		var twoByThreeShape1 = new TwoByThreeShape1();
		var twoByThreeShape2 = new TwoByThreeShape2();
		var twoByThreeShape3 = new TwoByThreeShape3();
		var current = null;
		var timer = 0;
		var interval = 250; // in milisecond
		var ContainerClass = ".box-container";
				
		$.Tetris.InitializeVariable = function(){
			tops = new Array();
			segments = new Array();
			// Resets variable tops.
			// If the block reaches the top, it should be stoped.
			for (var i = 0; i < cols; i++) {
				tops[i] = getTopInPixel(rows - 1);
				segments[i] = new EmptySegments();
			}
			current = null;
		};

		$.Tetris.Start = function() {			
			var shapeIndex = Math.floor(Math.random() * Shape.Total);
			// var shapeIndex = Shape.FourByOne; // For testing only
			current = MakeBlock(shapeIndex);
			var state = Math.floor(Math.random() * State.Total);
			current.Initialize($(ContainerClass), state);
			ClearTimer(timer);
			timer = setInterval(mainLoop, interval);
			$(document).bind('keydown', keydownHandler);
		}
		function mainLoop() {
			var isTerminated = false;
			if (isLanded(current)) {
				$(document).unbind('keydown');
				ClearTimer();

				// Clones the boxes to the container.
				var stationaryRowIndex = current.rowIndex;
				var stationaryColumnIndex = current.columnIndex;
				var totalRows = current.GetRows();
				for(var i = totalRows - 1; i >= NumberConst.Zero; i--) {
					var itemsInRow = current.GetRow(i);
					var clonedItems = new Array();
					var finalBoxRowIndex = stationaryRowIndex + i;
					for(var j = NumberConst.Zero; j < itemsInRow.length; j++) {
						var itemInRow = $(itemsInRow[j]);
						var internalColumnIndex = itemInRow.position().left / (boxWidth + gap);
						var finalBoxColumnIndex = stationaryColumnIndex + internalColumnIndex;
						var newItem = itemInRow.clone(false);
						newItem.removeClass();
						newItem.addClass('box-base');
						newItem.addClass(current.MakeXPositionClass(finalBoxRowIndex));
						newItem.addClass(current.MakeYPositionClass(finalBoxColumnIndex));
						var finalBoxLeft = current.block.position().left + itemInRow.position().left;
						var finalBoxTop = current.block.position().top + itemInRow.position().top;
						newItem.css({'left': finalBoxLeft + 'px', 'top': finalBoxTop + 'px'});
						clonedItems.push(newItem);
						// Updates the variable tops.
						var expectedTop = finalBoxTop + boxWidth + gap;
						if (tops[finalBoxColumnIndex] < expectedTop) {
							segments[finalBoxColumnIndex].Divide(finalBoxRowIndex);
						} else {
							if (tops[finalBoxColumnIndex] > expectedTop) {
								var vEndIndex = Math.floor(tops[finalBoxColumnIndex] / (boxWidth + gap) - 1);
								segments[finalBoxColumnIndex].Push(new EmptySegment(finalBoxRowIndex + 1, vEndIndex));
							}
							tops[finalBoxColumnIndex] = finalBoxTop;
						}
						if (finalBoxTop < (gap+1)) {
							isTerminated = true;
						}
					}
					$.each(clonedItems, function(index, element) {
						$(element).appendTo($(ContainerClass));
					});
				}

				// If a row is filled wholly, then this row should be omitted and the player wins a score.
				// All the rows above this one should be slipped down.
				for (var i = NumberConst.Zero; i < totalRows; i++) {
					var variable = stationaryRowIndex + i;
					var items = $(ContainerClass).children(current.MakeXPositionClassSelector(variable));
					if (items.length == cols) {
						$.each(items, function(index, element) {
							$(element).remove();
						});
						for (var j = NumberConst.Zero; j < cols; j++) {
							if (segments[j].Length() > NumberConst.Zero) {
								if ((segments[j].Top().startIndex - NumberConst.One) == variable) {
									tops[j] = getTopInPixel(segments[j].Top().endIndex);
									segments[j].Pop();
								} else {
									segments[j].MergeConjunctive(new EmptySegment(variable, variable));
									tops[j] = tops[j] + (boxWidth + gap);
									
									// Because the tiles will be slipped down, so does the segments variable.
									$.each(segments[j].items, function(index, element) {
										if (element.endIndex < variable) {
											element.startIndex += NumberConst.One;
											element.endIndex += NumberConst.One;
										}
									});
								}
							} else {
								tops[j] = Math.min(tops[j] + (boxWidth + gap), (rows * (gap + boxHeight) + NumberConst.One));
							}
						}
													
						variable--;
						var lastRow = $(ContainerClass).children(current.MakeXPositionClassSelector(variable));
						while (lastRow.length > NumberConst.Zero) {
							lastRow.each(function(index, element) {
								$(element).removeClass(current.MakeXPositionClass(variable));
								$(element).addClass(current.MakeXPositionClass(variable + NumberConst.One));
								$(element).css('top', ($(element).position().top + (boxWidth + gap)) + 'px');
							});
							variable--;
							lastRow = $(ContainerClass).children(current.MakeXPositionClassSelector(variable));
						}
					}
				}

				// Destroys the block.
				current.Destroy();

				if (!!(isTerminated == false)) {
					// Restarts the process.
					$.Tetris.Start();
				}
			} else {
				// Sets rowIndex, top.
				current.rowIndex++;
				current.block.css('top', (current.block.position().top + (boxWidth + gap)) + 'px');
				if ((current.rowIndex + current.GetRows()) > rows) {
					throw ('The tile is out of box!!!!');
				}
			}
		}
		function ClearTimer() {
			if (timer != NumberConst.Zero) {
				clearInterval(timer);
			}
		}
		function MakeBlock(shapeIndex) {
			if (shapeIndex == Shape.FourByOne) {
				return fourByOneShape;
			} else if (shapeIndex == Shape.ThreeByTwo) {
				return threeByTwoShape;
			} else if (shapeIndex == Shape.TwoByTwo) {
				return twoByTwoShape;
			} else if (shapeIndex == Shape.TwoByThree) {
				return twoByThreeShape;
			} else if (shapeIndex == Shape.TwoByThree1) {
				return twoByThreeShape1;
			} else if (shapeIndex == Shape.TwoByThree2) {
				return twoByThreeShape2;
			} else if (shapeIndex == Shape.TwoByThree3) {
				return twoByThreeShape3;
			} else {
				throw ('ShapeIndex: ' + shapeIndex + 'is invalid in method MakeBlock!');
			}
		}

		function EmptySegment(startRowIndex, endRowIndex) {
			if (endRowIndex < startRowIndex) {
				throw ('Invalid parameters startRowIndex:' + startRowIndex + ',endRowIndex:' + endRowIndex );
			}
			this.startIndex = startRowIndex;
			this.endIndex = endRowIndex;
		}

		function getTopInPixel(rowIndex) {
			return ((rowIndex + 1) * (boxHeight + gap)) + gap;
		}
		function isLanded(shape) {
			var result = false;
			for (var columnIndex = shape.GetColumns() - 1; columnIndex >= 0; columnIndex--) {
				var box = $(shape.GetEndBoxInColumn(columnIndex));
				var currentTop = current.block.position().top + box.position().top + boxHeight + gap;
				var currentRowIndex = current.rowIndex + Math.floor(box.position().top / (boxHeight + gap));
				var currentColumnIndex = current.columnIndex + columnIndex;
				if ((currentTop >= tops[current.columnIndex + columnIndex]) && 
					!segments[currentColumnIndex].Contains(currentRowIndex))
				{
					result = true;
					break;
				}
			}
			return result;
		}
		function moveDown(selector) {
			$(selector).each(function (index, element) {
				$(element).css('top', ($(element).position().top + boxHeight + gap) + 'px');
			});
		}
		function moveUp(selector) {
			$(selector).each(function (index, element) {
				$(element).css('top', ($(element).position().top - boxHeight - gap) + 'px');
			});
		}
		function moveLeft(selector) {
			$(selector).each(function (index, element) {
				$(element).css('left', ($(element).position().left - boxHeight - gap) + 'px');
			});
		}
		function moveRight(selector) {
			$(selector).each(function (index, element) {
				$(element).css('left', ($(element).position().left + boxHeight + gap) + 'px');
			});
		}
		function keydownHandler(eventObject) {
			if (eventObject.keyCode == KeyCode.Up) {
				// Transformation here
				current.Transform((current.state + 1) % State.Total);
			} else if (eventObject.keyCode == KeyCode.Down) {
				// Acceleration here
			} else if (eventObject.keyCode == KeyCode.Left) {
				// 1. Pauses the timer.
				// 2. If we do not reach left-most in the row,
				//    we move left; Otherwise, do nothing.
				// 3. Restarts the timer.
				if (current.columnIndex >= NumberConst.One) {
					var rowCount = current.GetRows();
					var columnIndex;
					var isCollapsed = false;
					for (var i = NumberConst.Zero; i < rowCount; i++) {
						var firstItemInRow = $(current.GetStartBoxInRow(i));
						columnIndex = firstItemInRow.position().left / (boxWidth + gap);
						columnIndex += (current.columnIndex - NumberConst.One);
						if (columnIndex >= 0) {
							if ((tops[columnIndex] > (current.block.position().top + firstItemInRow.position().top)) || 
								(segments[columnIndex].Contains(current.rowIndex + i))) {
								isCollapsed = false;
							} else {
								isCollapsed = true;
								break;
							}
						} else {
							isCollapsed = true;
							break;
						}
					}
					if (!isCollapsed) {
						current.columnIndex--;
						current.block.css('left', (current.block.position().left - (boxWidth + gap)) + 'px');
					}
				}

			} else if (eventObject.keyCode == KeyCode.Right) {
				// 1. Pauses the timer.
				// 2. If we do not reach right-most in the row,
				//    we move right; otherwise, do nothing.
				// 3. Restarts the timer.
				if ((current.columnIndex + current.GetColumns()) <= (cols - NumberConst.One)) {
					var rowCount = current.GetRows();
					var columnIndex;
					var isCollapsed = false;
					for (var i = NumberConst.Zero; i < rowCount; i++) {
						var endItemInRow = $(current.GetEndBoxInRow(i));
						columnIndex = endItemInRow.position().left / (boxWidth + gap);
						columnIndex += (current.columnIndex + NumberConst.One);
						if (columnIndex < cols) {
							if ((tops[columnIndex] > (current.block.position().top + endItemInRow.position().top)) || 
								(segments[columnIndex].Contains(current.rowIndex + i))) {
								isCollapsed = false;
							} else {
								isCollapsed = true;
								break;
							}
						} else {
							isCollapsed = true;
							break;
						}
					}
					if (!isCollapsed) {
						current.columnIndex++;
						current.block.css('left', (current.block.position().left + (boxWidth + gap)) + 'px');
					}
				}
			}
		}
})(jQuery);
