var ImageSource = require("image-source").ImageSource;
var cellIdentifier = "Cell";

var MenuViewController = UIKit.UITableViewController.extends({
    viewDidLoad: function() {
        this.super.viewDidLoad();

        this.cellData = [
            {
                name: 'Home'
            },
            {
                name: 'About'
            }
        ];

        this.selectedRow = 0;

        // setup table view
        this.tableView.backgroundColor = UIKit.UIColor.colorWithRedGreenBlueAlpha(0.866667, 0.886275, 0.894118, 1);
        this.tableView.rowHeight = 50;
        this.tableView.separatorStyle = UIKit.UITableViewCellSeparatorStyle.UITableViewCellSeparatorStyleNone;
        this.tableView.backgroundView = null; // otherwise background color cannot be seen

        // header view
        var headerView = UIKit.UIView.initWithFrame(CoreGraphics.CGRectMake(0, 0, this.tableView.frame.size.width, 44));
        var label = UIKit.UILabel.initWithFrame(CoreGraphics.CGRectMake(60, 0, this.tableView.frame.size.width - 60, 44));
        label.autoresizingMask = UIKit.UIViewAutoresizing.UIViewAutoresizingFlexibleWidth;
        label.font = UIKit.UIFont.fontWithNameSize("HelveticaNeue-Thin", 29);
        label.text = 'Cuteness';
        headerView.addSubview(label);

        var imageView = UIKit.UIImageView.initWithFrame(CoreGraphics.CGRectMake(24, 6, 28, 31));
        var image = new ImageSource();
        image.loadFromResource('logo');
        imageView.image = image.ios;
        headerView.addSubview(imageView);

        this.tableView.tableHeaderView = headerView;
    },

    viewWillAppear: function(animated) {
        var indexPath = UIKit.NSIndexPath.indexPathForRowInSection(this.selectedRow, 0);
        this.tableView.selectRowAtIndexPathAnimatedScrollPosition(indexPath, false, UIKit.UITableViewScrollPosition.UITableViewScrollPositionNone);
    },

    setViewControllers: function(viewControllers) {
        this.viewControllers = viewControllers;
    }

}, {
}).implements({

        protocol: "UITableViewDataSource",

        implementation: {
            tableViewNumberOfRowsInSection: function(tableView, section) {
                return 2;
            },

            tableViewCellForRowAtIndexPath: function(tableView, indexPath) {
                var cell = tableView.dequeueReusableCellWithIdentifier(cellIdentifier);

                if (!cell) {
                    // setup new cell
                    cell = UIKit.UITableViewCell.initWithStyleReuseIdentifier(UIKit.UITableViewCellStyle.UITableViewCellStyleDefault, cellIdentifier);

                    var lineView =  UIKit.UIView.initWithFrame(CoreGraphics.CGRectMake(8, 49, 256 - 8, 1));
                    lineView.backgroundColor = UIKit.UIColor.colorWithRedGreenBlueAlpha(0.752941, 0.784314, 0.800000, 1);
                    cell.contentView.addSubview(lineView);

                    var bgView = new UIKit.UIView();
                    bgView.backgroundColor = UIKit.UIColor.colorWithRedGreenBlueAlpha(0.866667, 0.886275, 0.894118, 1);
                    cell.backgroundView = bgView;

                    var selectedBGView = new UIKit.UIView();
                    selectedBGView.backgroundColor = UIKit.UIColor.colorWithRedGreenBlueAlpha(16/255, 196/255, 178/255, 1);
                    cell.selectedBackgroundView = selectedBGView;

                    cell.textLabel.font = UIKit.UIFont.fontWithNameSize("HelveticaNeue-Thin", 17);
              
                    cell.indentationWidth = 8;
                    cell.indentationLevel = 1;
                }

                cell.textLabel.text = this.cellData[indexPath.row].name;

                if (indexPath.row === this.selectedRow) {
                    tableView.selectRowAtIndexPathAnimatedScrollPosition(indexPath, false, UIKit.UITableViewScrollPosition.UITableViewScrollPositionNone);
                }

                return cell;
            }
        }
    }
).implements({

        protocol: "UITableViewDelegate",

        implementation: {
            tableViewDidSelectRowAtIndexPath: function(tableView, indexPath) {
                if (this.selectedRow !== indexPath.row) {
                    this.selectedRow = indexPath.row;

                    this.slideOut.changeMain(this.viewControllers[this.selectedRow]);
                    this.slideOut.toggleMenu();
                }
            }
        }
    }
);

module.exports = MenuViewController;